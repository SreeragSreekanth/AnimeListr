from rest_framework import serializers
from .models import Genre, Anime

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['id', 'name']

class AnimeSerializer(serializers.ModelSerializer):
    average_rating = serializers.SerializerMethodField()
    genres = GenreSerializer(many=True, read_only=True)
    genre_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Genre.objects.all(),
        write_only=True,
        source='genres'
    )

    class Meta:
        model = Anime
        fields = [
            'id',
            'title',
            'slug',
            'description',
            'cover_image',
            'release_year',
            'episode_count',
            'genres',
            'genre_ids',
            'status',
            'average_rating',
            'is_public_api',
            'public_api_id',
            'created_at',
        ]
        read_only_fields = ['slug', 'average_rating', 'created_at']


    def get_average_rating(self, obj):
        return obj.average_rating