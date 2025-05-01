from django.contrib import admin
from django.urls import path, include, re_path
from django.http import JsonResponse
from tech_catch.views import index
def index_view(request):
    return JsonResponse({"message": "TechCatch backend is alive."})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('tech_catch.urls')),  
    re_path(r'^.*$', index),
]
