from rest_framework import generics, permissions, viewsets, status
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, UserCreateSerializer

User = get_user_model()


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    View to retrieve and update the current user's profile.
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserManagementViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing users. Only accessible by admin users.
    Provides list, create, retrieve, update, and delete operations.
    """
    queryset = User.objects.all().order_by('-date_joined')
    permission_classes = [permissions.IsAdminUser]

    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer

    def destroy(self, request, *args, **kwargs):
        """
        Prevent users from deleting themselves.
        """
        instance = self.get_object()
        if instance == request.user:
            return Response(
                {"detail": "You cannot delete your own account."},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().destroy(request, *args, **kwargs)
