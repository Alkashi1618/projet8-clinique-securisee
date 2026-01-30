from django.contrib import admin
from .models import Patient, RendezVous


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ("matricule", "nom", "prenom", "medecin", "created_at")
    search_fields = ("matricule", "nom", "prenom")
    list_filter = ("medecin",)


@admin.register(RendezVous)
class RendezVousAdmin(admin.ModelAdmin):
    list_display = ("patient", "medecin", "date", "heure", "statut")
    list_filter = ("statut", "date", "medecin")
