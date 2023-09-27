from django.shortcuts import render
from rest_framework import viewsets, generics, permissions, views
from .serializers import UserAccountSerializer, PostSerializer
from .models import UserAccount, Post
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework_simplejwt import views as jwt_views
from rest_framework_simplejwt import exceptions as jwt_exp
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
import jwt
from mysite import settings


# Create your views here.


class MyCustomPermission(IsAuthenticated):
    def has_permission(self, request, view):
        if request.method == "POST":
            return True
        else:
            return super().has_permission(request, view)


class UserAccountViews(viewsets.ModelViewSet):
    # 認証が必要であることの設定
    permission_classes = (MyCustomPermission,)
    queryset = UserAccount.objects.all()
    serializer_class = UserAccountSerializer


class TokenObtainView(jwt_views.TokenObtainPairView):
    # Token発行
    def post(self, request, *args, **kwargs):
        # 任意のSerializerを引っ張ってくる(今回はTokenObtainPairViewで使われているserializers.TokenObtainPairSerializer)
        serializer = self.get_serializer(data=request.data)
        # 検証
        try:
            serializer.is_valid(raise_exception=True)
        # エラーハンドリング
        except jwt_exp.TokenError as e:
            raise jwt_exp.InvalidToken(e.args[0])

        res = Response(serializer.validated_data, status=status.HTTP_200_OK)

        try:
            res.delete_cookie("access_token")
        except Exception as e:
            print(e)

        # CookieヘッダーにTokenをセットする
        res.set_cookie(
            "access_token",
            serializer.validated_data["access"],
            max_age=60 * 60 * 24,
            httponly=True,
            samesite="None",
        )
        res.set_cookie(
            "refresh_token",
            serializer.validated_data["refresh"],
            max_age=60 * 60 * 24 * 30,
            httponly=True,
            samesite="None",
        )

        # 最終的にはaccess_tokenとrefresh_tokenを返してもらう
        return res


# CookieからRefresh_Token取得
# クライアント側からこいつを叩いてから下のクラスへとリクエストを投げる
def refresh_get(request):
    try:
        refresh_token = request.COOKIES["refresh_token"]
        return JsonResponse({"refresh": refresh_token}, safe=False)
    except Exception as e:
        print(e)
        return None


# HTTPRequestのBodyプロパティから送られてきたtokenを受け取る
class TokenRefresh(jwt_views.TokenRefreshView):
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except jwt_exp.TokenError as e:
            raise jwt_exp.InvalidToken(e.args[0])
        # token更新
        res = Response(serializer.validated_data, status=status.HTTP_200_OK)
        # 既存のAccess_Tokenを削除
        res.delete_cookie("access_token")
        # 更新したTokenをセット
        res.set_cookie(
            "access_token",
            serializer.validated_data["access"],
            max_age=60 * 24 * 24 * 30,
            httponly=True,
        )
        res.set_cookie(
            "refresh_token",
            serializer.validated_data["refresh"],
            max_age=60 * 60 * 24 * 30,
            httponly=True,
            samesite="None",
        )
        return res


# get currentUser
class UserAPIView(views.APIView):
    def get_object(self, JWT):
        try:
            payload = jwt.decode(jwt=JWT, key=settings.SECRET_KEY, algorithms=["HS256"])
            # DBにアクセスせずuser_idだけの方がjwtの強みが生きるかも
            # その場合 return payload["user_id"]
            return UserAccount.objects.get(id=payload["user_id"])

        except jwt.ExpiredSignatureError:
            # access tokenの期限切れ
            return "Activations link expired"
        except jwt.exceptions.DecodeError:
            return "Invalid Token"
        except UserAccount.DoesNotExist:
            return "user does not exists"

    def get(self, request, format=None):
        JWT = request.COOKIES.get("access_token")
        if not JWT:
            return Response({"error": "No token"}, status=status.HTTP_400_BAD_REQUEST)
        user = self.get_object(JWT)

        # エラーならstringで帰ってくるので、型で判定
        # ここイケてないな
        if type(user) == str:
            return Response({"error": user}, status=status.HTTP_400_BAD_REQUEST)

        if user.is_active:
            serializer = UserAccountSerializer(user)
            return Response(serializer.data)
        return Response(
            {"error": "user is not active"}, status=status.HTTP_400_BAD_REQUEST
        )


class LogoutView(views.APIView):
    # LogoutでCookieからToken削除
    # blacklist()を使って、RefreshTokenを無効にする処理を入れてもよい？
    def post(self, request):
        # access_token = request.COOKIES.get("access_token")
        # if not access_token:
        #     Response({"message": "no Token"})
        # else:
        #     res1 = Response(access_token)

        # refresh_token = request.COOKIES.get("refresh_token")
        # if not refresh_token:
        #     Response({"message": "no Token"})
        # else:
        #     res2 = Response(access_token)
        # try:
        #     res1.delete_cookie("access_token")
        #     res2.delete_cookie("refresh_token")
        # except Exception as e:
        #     print(e)
        #     return None
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(
                {"detail": "Successfully logged out."}, status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"detail": "Invalid refresh token."}, status=status.HTTP_400_BAD_REQUEST
            )

        # serializer = self.get_serializer(data=request.data)

        # # try:
        # #     serializer.is_valid(raise_exception=True)
        # # except jwt_exp.TokenError as e:
        # #     raise jwt_exp.InvalidToken(e.args[0])

        # # res = Response(serializer.validated_data, status=status.HTTP_200_OK)

        # # return Response({"Message": "Logout"}, status=status.HTTP_200_OK)


class PostView(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer


class PostDetailView(generics.RetrieveAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
