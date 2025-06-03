from rest_framework import viewsets, permissions,status
from .models import Anime, Genre
from .serializers import AnimeSerializer, GenreSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from django.utils.text import slugify
from rest_framework.response import Response
from rest_framework.views import APIView
from .utils import fetch_anilist_data
import django_filters



class GenreViewSet(viewsets.ModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

class AnimeFilter(django_filters.FilterSet):
    genre = django_filters.CharFilter(field_name="genres__slug", lookup_expr='iexact')
    release_year = django_filters.NumberFilter()
    min_year = django_filters.NumberFilter(field_name='release_year', lookup_expr='gte')
    max_year = django_filters.NumberFilter(field_name='release_year', lookup_expr='lte')
    status = django_filters.CharFilter(lookup_expr='iexact')

    class Meta:
        model = Anime
        fields = ['genre', 'release_year','min_year', 'max_year', 'status']

class AnimeViewSet(viewsets.ModelViewSet):
    queryset = Anime.objects.all().order_by('-created_at')
    serializer_class = AnimeSerializer
    lookup_field = 'slug'

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = AnimeFilter
    search_fields = ['title']
    ordering_fields = ['rating', 'popularity', 'release_year', 'title']
    ordering = ['-created_at']  # default ordering

    

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]


class AniListAutoImportView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request):
        title = request.data.get('title')
        if not title:
            return Response({'error': 'Title is required'}, status=400)

        anime_data = fetch_anilist_data(title)
        if not anime_data:
            return Response({'error': 'Anime not found'}, status=404)

        if Anime.objects.filter(public_api_id=anime_data['id']).exists():
            return Response({'detail': 'Anime already imported.'}, status=400)

        # Handle genres
        genre_objs = []
        for genre_name in anime_data['genres']:
            genre_obj, _ = Genre.objects.get_or_create(name=genre_name)
            genre_objs.append(genre_obj)

        anime = Anime.objects.create(
            title=anime_data['title']['romaji'],
            slug=slugify(anime_data['title']['romaji']),
            description=anime_data.get('description') or '',
            cover_image=anime_data['coverImage']['large'],
            release_year=anime_data['startDate']['year'],
            episode_count=anime_data.get('episodes') or 0,
            status=anime_data['status'].lower(),
            is_public_api=True,
            public_api_id=anime_data['id'],
        )
        anime.genres.set(genre_objs)

        return Response({'detail': 'Anime imported successfully'}, status=201)