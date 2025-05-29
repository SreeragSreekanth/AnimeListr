from rest_framework import viewsets, permissions
from .models import Anime, Genre
from .serializers import AnimeSerializer, GenreSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

class GenreViewSet(viewsets.ModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

class AnimeViewSet(viewsets.ModelViewSet):
    queryset = Anime.objects.all().order_by('-created_at')
    serializer_class = AnimeSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['genres__name', 'release_year', 'average_rating']
    search_fields = ['title']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]
