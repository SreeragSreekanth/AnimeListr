# Generated by Django 5.0.6 on 2025-06-10 15:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('anime', '0005_alter_genre_slug'),
    ]

    operations = [
        migrations.AddField(
            model_name='anime',
            name='type',
            field=models.CharField(choices=[('TV', 'TV'), ('Movie', 'Movie'), ('OVA', 'OVA'), ('ONA', 'ONA'), ('Special', 'Special'), ('Music', 'Music'), ('Other', 'Other')], default='TV', max_length=20),
        ),
    ]
