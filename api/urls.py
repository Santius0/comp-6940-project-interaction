from django.urls import path
from . import views

urlpatterns = [
    path('', views.main, name='main'),
    path('predict', views.predict_song, name='predict'),
    path('fetch-all-songs', views.all_songs, name='fetch_all_songs'),
    path('spotify-search', views.spotify_search, name='spotify_search'),
]
