from django.urls import path

from . import views

urlpatterns = [
    path('index', views.index),
    path('add', views.add_produit),
    path('formulaire', views.formulaire),
    path('contact', views.contact)
]
