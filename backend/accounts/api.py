from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Patient, RendezVous
from .serializers import PatientSerializer, RendezVousSerializer


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def patients_api(request):

    # 🔹 LECTURE : tous les utilisateurs authentifiés
    if request.method == "GET":
        patients = Patient.objects.all()
        serializer = PatientSerializer(patients, many=True)
        return Response(serializer.data)

    # 🔹 CRÉATION : Admin ou Secrétaire uniquement
    if request.method == "POST":
        if not (IsAdmin().has_permission(request, None) or
                IsSecretaire().has_permission(request, None)):
            return Response(
                {"detail": "Permission refusée"},
                status=403
            )

        serializer = PatientSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)

@api_view(["GET", "POST", "PATCH"])
@permission_classes([IsAuthenticated])
def rendezvous_api(request):

    # 🔹 LECTURE : tous
    if request.method == "GET":
        rdv = RendezVous.objects.all()
        serializer = RendezVousSerializer(rdv, many=True)
        return Response(serializer.data)

    # 🔹 CRÉATION / MODIFICATION : Admin ou Secrétaire
    if not (IsAdmin().has_permission(request, None) or
            IsSecretaire().has_permission(request, None)):
        return Response(
            {"detail": "Permission refusée"},
            status=403
        )

    if request.method == "POST":
        serializer = RendezVousSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    if request.method == "PATCH":
        rdv = RendezVous.objects.get(id=request.data["id"])
        rdv.statut = request.data["statut"]
        rdv.save()
        return Response({"message": "Statut mis à jour"})
