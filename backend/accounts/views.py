from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User, Group
from .models import Patient, RendezVous
from .serializers import PatientSerializer, RendezVousSerializer
from .permissions import IsAdmin, IsSecretaire


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    user = request.user

    groups = list(user.groups.values_list("name", flat=True))

    return Response({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "roles": groups
    })


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def patients_api(request):

    if request.method == "GET":
        patients = Patient.objects.all()
        serializer = PatientSerializer(patients, many=True)
        return Response(serializer.data)

    if not (
        IsAdmin().has_permission(request, None)
        or IsSecretaire().has_permission(request, None)
    ):
        return Response({"detail": "Permission refusée"}, status=403)

    serializer = PatientSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(["GET", "POST", "PATCH"])
@permission_classes([IsAuthenticated])
def rendezvous_api(request):

    if request.method == "GET":
        rdv = RendezVous.objects.all()
        serializer = RendezVousSerializer(rdv, many=True)
        return Response(serializer.data)

    if not (
        IsAdmin().has_permission(request, None)
        or IsSecretaire().has_permission(request, None)
    ):
        return Response({"detail": "Permission refusée"}, status=403)

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


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def medecins_api(request):
    medecins = User.objects.filter(groups__name="Medecin")

    data = [
        {
            "id": m.id,
            "username": m.username,
            "prenom": m.first_name,
            "nom": m.last_name,
        }
        for m in medecins
    ]

    return Response(data)

