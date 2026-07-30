from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from djangoapp import views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("djangoapp/", include("djangoapp.urls")),
    path("", views.index_view, name="index"),
    path("about/", views.about_view, name="about"),
    path("contact/", views.contact_view, name="contact"),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])
