from rest_framework import serializers
from .models import Watchlist
from anime.models import Anime  


class AnimeMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Anime
        fields = ['id', 'title', 'cover_image','slug'] 

class WatchlistSerializer(serializers.ModelSerializer):
    anime = AnimeMiniSerializer(read_only=True)
    anime_id = serializers.PrimaryKeyRelatedField(
        queryset=Anime.objects.all(),
        source='anime',
        write_only=True
    )

    class Meta:
        model = Watchlist
        fields = ['id', 'anime', 'anime_id', 'status', 'added_at']
        read_only_fields = ['id', 'added_at']
