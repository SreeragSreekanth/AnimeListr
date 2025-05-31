from rest_framework import viewsets, permissions
from .models import Post, Comment, Report
from .serializers import PostSerializer, CommentSerializer, ReportSerializer
from notifications.models import Notification
from django.contrib.auth import get_user_model


User = get_user_model()


class IsAuthorOrReadOnly(permissions.BasePermission):
    """
    Custom permission: only author or admin can edit/delete
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author == request.user or request.user.is_staff


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]

    def get_queryset(self):
        post_pk = self.kwargs.get('post_pk')  # get post ID from nested URL
        if post_pk:
            return Comment.objects.filter(post_id=post_pk).order_by('created_at')
        return Comment.objects.none()

    def perform_create(self, serializer):
        post_pk = self.kwargs.get('post_pk')
        comment = serializer.save(author=self.request.user, post_id=post_pk)

        post = comment.post
        post_owner = post.author

        if post_owner != self.request.user:
            Notification.objects.create(
                user=post_owner,
                message=f"{self.request.user.username} commented on your post '{post.title}'.",
                post=post,
                comment=comment
            )



class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all().order_by('-created_at')
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        report = serializer.save(user=self.request.user)

        # Notify all admin users
        admins = User.objects.filter(is_staff=True)
        for admin in admins:
            Notification.objects.create(
                user=admin,
                message=f"{self.request.user.username} reported a {'comment' if report.comment else 'post'}.",
                post=report.post,
                # optionally comment=report.comment,
            )

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Report.objects.all()
        return Report.objects.filter(user=user)
