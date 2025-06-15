from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AnimeViewSet, GenreViewSet, AniListAutoImportView
from reviews.views import ReviewViewSet
from rest_framework_nested import routers as nested_routers

# Base routers
router = DefaultRouter()
router.register(r'anime', AnimeViewSet, basename='anime')
router.register(r'genres', GenreViewSet, basename='genre')

# Nested router: /anime/<slug>/reviews/
anime_router = nested_routers.NestedDefaultRouter(router, r'anime', lookup='anime')
anime_router.register(r'reviews', ReviewViewSet, basename='anime-reviews')

# New: Top-level router for direct review access: /reviews/<id>/
review_router = DefaultRouter()
review_router.register(r'reviews', ReviewViewSet, basename='review')

urlpatterns = [
    path('', include(router.urls)),              # /anime/, /genres/
    path('', include(anime_router.urls)),        # /anime/<slug>/reviews/
    path('', include(review_router.urls)),       # /reviews/<id>/
    path('auto-import-anilist/', AniListAutoImportView.as_view(), name='auto-import-anilist'),
]
