from django.db import models
from django.contrib.auth.models import User


class Patient(models.Model):
    matricule = models.CharField(max_length=20, unique=True)
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    telephone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)

    medecin = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name="patients"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.matricule} - {self.nom} {self.prenom}"


class RendezVous(models.Model):
    STATUT_CHOICES = [
        ("planifie", "Planifié"),
        ("annule", "Annulé"),
        ("termine", "Terminé"),
    ]

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    medecin = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    heure = models.TimeField()
    statut = models.CharField(
        max_length=20,
        choices=STATUT_CHOICES,
        default="planifie"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("date", "heure", "medecin")

    def __str__(self):
        return f"{self.patient} - {self.date} {self.heure}"
