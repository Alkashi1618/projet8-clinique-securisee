from django.urls import path
from .views import (
    me,
    patients_api,
    rendezvous_api,
    medecins_api,
)

urlpatterns = [
    path("me/", me, name="me"),
    path("patients/", patients_api, name="patients_api"),
    path("rendezvous/", rendezvous_api, name="rendezvous_api"),
    path("medecins/", medecins_api, name="medecins_api"),
]
