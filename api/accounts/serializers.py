from rest_framework import serializers
from .models import UserAccount, Post


class UserAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccount
        fields = ("id", "email", "name", "password", "is_staff")

        extra_kwargs = {
            "password": {
                # セキュリティの関係上パスワードは書き込むだけ。
                "write_only": True,
                # パスワード入力の際に「・・・」となるようにstyleを指定
                "style": {"input_type": "password"},
            }
        }

    # このcreateメソッドは何が呼ばれているのか
    def create(self, validated_data):
        user = UserAccount.objects.create_user(
            email=validated_data["email"],
            name=validated_data["name"],
            password=validated_data["password"],
        )
        return user

    def update(self, instance, validated_data):
        if "password" in validated_data:
            password = validated_data.pop("password")
            instance.set_password(password)
        return super().update(instance, validated_data)


class PostSerializer(serializers.ModelSerializer):
    # created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M")

    # def create(self, validated_data):
    #     post = Post.objects.create(
    #         title=validated_data["title"],
    #         content=validated_data["content"],
    #         user_id=validated_data["user_id"],
    #     )
    #     post.save()
    #     return post

    class Meta:
        model = Post
        fields = ("id", "title", "content", "created_at", "user_id")
