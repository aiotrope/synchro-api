from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
# from django.conf.urls import url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.views import defaults as default_views
from django.views.generic import TemplateView
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)

from users.api.views import ActivateUser, FacebookLogin, GoogleLogin, UserRedirectSocial


urlpatterns = [
    path('', TemplateView.as_view(template_name='pages/home.html'), name='home'),
    path(
        'about/', TemplateView.as_view(template_name='pages/about.html'), name='about'
    ),
    path(settings.ADMIN_URL, admin.site.urls),
    path('users/', include('users.urls', namespace='users')),
    path('api/social-credentials/', UserRedirectSocial.as_view(), name='redirect_social'),
    path('accounts/', include("allauth.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# API URLS
urlpatterns += [
    # API base URL
    path('api/', include('core.api_router')),
    # DRF auth token
    path('auth-token/', obtain_auth_token),
    # Login via browsable API
    path('api-auth/', include('rest_framework.urls')),
    # Rest Auth via djoser
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.authtoken')),
    path('auth/', include('djoser.urls.jwt')),
    path('auth/', include('djoser.social.urls')),
    path('auth/users/activate/<uid>/<token>/',
         ActivateUser.as_view(), name='activation'),
    # Social Auth
    path('social/', include('dj_rest_auth.urls')),
    path('social/google/', GoogleLogin.as_view(), name='google_login'),
    path('social/fb/', FacebookLogin.as_view(), name='fb_login'),
    # Simple JWT
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]

if settings.DEBUG:
    urlpatterns += [
        path(
            "400/",
            default_views.bad_request,
            kwargs={"exception": Exception("Bad Request!")},
        ),
        path(
            "403/",
            default_views.permission_denied,
            kwargs={"exception": Exception("Permission Denied")},
        ),
        path(
            "404/",
            default_views.page_not_found,
            kwargs={"exception": Exception("Page not Found")},
        ),
        path("500/", default_views.server_error),
    ]

urlpatterns += staticfiles_urlpatterns()
