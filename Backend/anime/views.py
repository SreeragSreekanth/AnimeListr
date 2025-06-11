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
        title = request.data.get("title")
        if not title:
            return Response({"detail": "Title is required"}, status=400)

        anime_data = fetch_anilist_data(title)
        if not anime_data:
            return Response({"detail": "No anime found on AniList."}, status=404)

        try:
            # Use the correct ID key
            public_api_id = str(anime_data.get("anilist_id"))
            if not public_api_id:
                print("AniList response missing 'anilist_id':", anime_data)
                return Response({"detail": "Invalid AniList response (missing id)."}, status=500)

            if Anime.objects.filter(public_api_id=public_api_id).exists():
                return Response({"detail": "Anime already exists."}, status=200)

            # Create anime object
            anime = Anime.objects.create(
                title=anime_data.get("title", "Unknown"),
                description=anime_data.get("description", ""),
                cover_image=anime_data.get("cover_image", ""),
                release_year=anime_data.get("release_year"),
                episode_count=anime_data.get("episode_count"),
                status=anime_data.get("status", "ongoing").lower(),  # match choices
                type=anime_data.get("type", "TV"),  # match TYPE_CHOICES
                is_public_api=True,
                public_api_id=public_api_id,
            )

            # Handle genres (create if not exists)
            genre_names = anime_data.get("genres", [])
            for name in genre_names:
                genre_obj, _ = Genre.objects.get_or_create(name=name)
                anime.genres.add(genre_obj)

            return Response({"detail": f"Imported anime: {anime.title}"}, status=201)

        except Exception as e:
            print("Error during anime import:", str(e))
            return Response({"detail": "Import failed. Check server logs."}, status=500)
