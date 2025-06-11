from django.db import models
from django.utils.text import slugify


class Genre(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=60, unique=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while Genre.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
    
    
class Anime(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    cover_image = models.URLField(blank=True, null=True)
    release_year = models.PositiveIntegerField(blank=True, null=True)
    episode_count = models.PositiveIntegerField(blank=True, null=True)
    genres = models.ManyToManyField(Genre, related_name='animes') 

    STATUS_CHOICES = [
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('upcoming', 'Upcoming'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ongoing')

    TYPE_CHOICES = [
    ('TV', 'TV'),
    ('Movie', 'Movie'),
    ('OVA', 'OVA'),
    ('ONA', 'ONA'),
    ('Special', 'Special'),
    ('Music', 'Music'),
    ('Other', 'Other'),
    ]
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='TV')

    
    is_public_api = models.BooleanField(default=False)
    public_api_id = models.CharField(max_length=100, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


    @property
    def average_rating(self):
        reviews = self.reviews.all()
        if reviews.exists():
            return round(sum([r.rating for r in reviews]) / reviews.count(), 1)
        return None



