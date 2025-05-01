from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def index_view(request):
    return JsonResponse({"message": "TechCatch backend is alive."})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', index_view),
    path('api/', include('tech_catch.urls')),  
]
