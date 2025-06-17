from django.urls import path, include
from rest_framework_nested import routers
from .views import PostViewSet, CommentViewSet, ReportViewSet

# Main routers
router = routers.DefaultRouter()
router.register(r'posts', PostViewSet)
router.register(r'reports', ReportViewSet)
router.register(r'comments', CommentViewSet, basename='all-comments')  # 👈 flat route

# Nested router for comments under posts
posts_router = routers.NestedDefaultRouter(router, r'posts', lookup='post')
posts_router.register(r'comments', CommentViewSet, basename='post-comments')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(posts_router.urls)),
]
