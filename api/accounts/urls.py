from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserAccountViews
from .views import (
    TokenObtainView,
    refresh_get,
    TokenRefresh,
    LogoutView,
    UserAPIView,
    PostView,
    PostDetailView,
)

router = DefaultRouter()

router.register("accounts", UserAccountViews)

urlpatterns = [
    path("", include(router.urls)),
    path("jwtcookie/create", TokenObtainView.as_view(), name="jwtcreate"),
    path("jwtcookie/refresh", refresh_get),
    path("jwtcookie/newtoken", TokenRefresh.as_view(), name="jwtrefresh"),
    path("loginuser/", UserAPIView.as_view(), name="loginuser"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("posts/", PostView.as_view(), name="post"),
    path("posts/<str:pk>", PostDetailView.as_view(), name="detail"),
]
