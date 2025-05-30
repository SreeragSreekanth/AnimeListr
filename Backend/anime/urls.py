from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AnimeViewSet,GenreViewSet,AniListAutoImportView
from reviews.views import ReviewViewSet
from rest_framework_nested import routers


router = DefaultRouter()
router.register(r'anime', AnimeViewSet, basename='anime')
router.register(r'genres', GenreViewSet, basename='genre')

# Nested router for reviews under anime (using slug lookup)
anime_router = routers.NestedDefaultRouter(router, r'anime', lookup='anime')
anime_router.register(r'reviews', ReviewViewSet, basename='anime-reviews')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(anime_router.urls)),  
    path('auto-import-anilist/', AniListAutoImportView.as_view(), name='auto-import-anilist'),
]
