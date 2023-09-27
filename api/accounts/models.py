from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
    BaseUserManager,
)


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("メールアドレスは必須です")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()

        return user

    def create_superuser(self, email, password=None, **extra_fields):
        user = self.create_user(email, password, **extra_fields)
        user.is_superuser = True
        user.is_staff = True
        user.save()

        return user


class UserAccount(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField("メールアドレス", max_length=255, unique=True)
    name = models.CharField("名前", max_length=255)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    def __str__(self):
        return self.email


class Post(models.Model):
    title = models.CharField(verbose_name="タイトル", max_length=255)
    content = models.CharField(verbose_name="本文", max_length=255)
    created_at = models.DateTimeField("作成日", auto_now_add=True)
    user_id = models.ForeignKey(UserAccount, on_delete=models.CASCADE)

    def __str__(self):
        return self.title
