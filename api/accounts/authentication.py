from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from django.conf import settings


class CookieHandlerJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # Cookieヘッダーからaccess_tokenを取得
        access_token = request.COOKIES.get("access_token")
        if not access_token:
            Response({"message": "no Token"})
        else:
            Response(access_token)

        if access_token:
            request.META["HTTP_AUTHORIZATION"] = "{header_type} {access_token}".format(
                header_type=settings.SIMPLE_JWT["AUTH_HEADER_TYPES"][0],
                access_token=access_token,
            )

        return super().authenticate(request)


class SameSiteMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        from mysite import settings

        for key in response.cookies.keys():
            response.cookies[key]["samesite"] = "Lax" if settings.DEBUG else "None"
            response.cookies[key]["secure"] = not settings.DEBUG
        return response
