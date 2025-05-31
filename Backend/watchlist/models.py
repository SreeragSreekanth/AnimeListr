# models.py
from django.db import models
from django.contrib.auth.models import User
from anime.models import Anime  # assuming anime app has Anime model

class Watchlist(models.Model):
    STATUS_CHOICES = [
        ('to_watch', 'To Watch'),
        ('watching', 'Watching'),
        ('completed', 'Completed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='watchlist_entries')
    anime = models.ForeignKey(Anime, on_delete=models.CASCADE, related_name='watchlist_entries')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'anime')  # No duplicate entries

    def __str__(self):
        return f"{self.user.username} - {self.anime.title} ({self.status})"
