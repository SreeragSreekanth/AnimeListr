from rest_framework import viewsets, permissions
from .models import Watchlist
from .serializers import WatchlistSerializer

class WatchlistViewSet(viewsets.ModelViewSet):
    serializer_class = WatchlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Watchlist.objects.filter(user=self.request.user).select_related('anime')
        status = self.request.query_params.get('status')
        if status in dict(Watchlist.STATUS_CHOICES):
            queryset = queryset.filter(status=status)
        return queryset


    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
