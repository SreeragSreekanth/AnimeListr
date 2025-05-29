from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AnimeViewSet,GenreViewSet

router = DefaultRouter()
router.register(r'anime', AnimeViewSet, basename='anime')
router.register(r'genres', GenreViewSet, basename='genre')


urlpatterns = [
    path('', include(router.urls)),
]
