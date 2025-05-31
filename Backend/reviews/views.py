# reviews/views.py
from rest_framework import viewsets, permissions
from .models import Review
from .serializers import ReviewSerializer
from anime.models import Anime
from rest_framework.exceptions import NotFound
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.method in permissions.SAFE_METHODS or obj.user == request.user

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_fields = ['rating', 'user__username']
    ordering_fields = ['created_at', 'rating']

    def get_queryset(self):
        anime_slug= self.kwargs.get('anime_slug')  # match 'lookup' param from nested router
        if not anime_slug:
            return Review.objects.none()  # or all reviews if you want
        try:
            anime = Anime.objects.get(id=anime_slug)
        except Anime.DoesNotExist:
            raise NotFound("Anime not found")
        return Review.objects.filter(anime=anime).order_by('-created_at')

    def perform_create(self, serializer):
        anime_slug = self.kwargs.get('anime_slug')
        anime = Anime.objects.get(id=anime_slug)
        serializer.save(user=self.request.user, anime=anime)