from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import UserRegisterView, index

urlpatterns = [
    path('scrape/qiita/', views.scrape_qiita_and_get_articles, name='scrape_qiita'),
    path('scrape/zenn/', views.scrape_zenn_and_get_articles, name='scrape_zenn'),
    path('scrape/note/', views.scrape_note_and_get_articles, name='scrape_note'),

    path('favorites/', views.favorite_articles, name='favorite_articles'),

    path('trend/qiita/', views.trend_qiita, name='trend_qiita'),
    path('trend/zenn/', views.trend_zenn, name='trend_zenn'),
    path('trend/note/', views.trend_note, name='trend_note'),
    path('trend/all/', views.trend_all_articles, name='trend_all_articles'),

    path('recommend/qiita/', views.get_qiita_recommend, name='recommend_qiita'),
    path('recommend/zenn/', views.get_zenn_recommend, name='recommend_zenn'),
    path('recommend/note/', views.get_note_recommend, name='recommend_note'),
    path('recommend/', views.recommend_articles, name='recommend_articles'),
    
    path('register/', UserRegisterView.as_view(), name='register'), 
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'), 
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), 
    
    path('', index, name='index'),
]
