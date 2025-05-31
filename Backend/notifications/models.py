from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    anime = models.ForeignKey('anime.Anime', on_delete=models.CASCADE, null=True, blank=True)
    post = models.ForeignKey('forum.Post', on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f"To {self.user.username}: {self.message[:50]}"
