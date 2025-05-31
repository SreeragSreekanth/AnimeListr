from rest_framework import viewsets, permissions
from .models import Watchlist
from .serializers import WatchlistSerializer

class WatchlistViewSet(viewsets.ModelViewSet):
    serializer_class = WatchlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Watchlist.objects.filter(user=self.request.user).select_related('anime')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
