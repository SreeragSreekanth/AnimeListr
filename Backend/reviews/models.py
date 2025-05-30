# reviews/models.py
from django.db import models
from django.conf import settings
from anime.models import Anime
from django.core.validators import MinValueValidator, MaxValueValidator


class Review(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    anime = models.ForeignKey(Anime, on_delete=models.CASCADE, related_name='reviews')
    text = models.TextField()
    rating = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(10)])  # 1 to 10
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user', 'anime']  # one review per user per anime
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user} - {self.anime} - {self.rating}"
