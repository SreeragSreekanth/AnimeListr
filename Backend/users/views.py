from rest_framework import generics,permissions,status
from rest_framework.response import Response
from django.contrib.auth.models import User
from .serializers import RegisterSerializer,UserSerializer,ChangePasswordSerializer
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.conf import settings



class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
    
    def update(self, request, *args, **kwargs):
        # Allow partial update so that user can update only bio or profile picture without sending all fields
        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)

class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Password updated successfully."}, status=status.HTTP_200_OK)

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({"detail": "Logout successful."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)
        

# Step 1 - Request Password Reset
class PasswordResetRequestView(APIView):
    def post(self, request):
        email = request.data.get("email")
        try:
            user = User.objects.get(email=email)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            reset_link = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}"  # Frontend page
            send_mail(
                "Password Reset Request",
                f"Click the link to reset your password: {reset_link}",
                "noreply@animehub.com",
                [email],
                fail_silently=False,
            )
            return Response({"message": "Password reset link sent."})
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=404)

# Step 2 - Confirm Password Reset
class PasswordResetConfirmView(APIView):
    def post(self, request, uidb64, token):
        password = request.data.get("new_password")
        confirm_password = request.data.get("re_new_password")

        if not password or not confirm_password:
            return Response({"error": "Both password fields are required."}, status=400)

        if password != confirm_password:
            return Response({"error": "Passwords do not match."}, status=400)

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
            if default_token_generator.check_token(user, token):
                user.set_password(password)
                user.save()
                return Response({"message": "Password reset successful."})
            return Response({"error": "Invalid token."}, status=400)
        except (User.DoesNotExist, ValueError, TypeError):
            return Response({"error": "Invalid request."}, status=400)
