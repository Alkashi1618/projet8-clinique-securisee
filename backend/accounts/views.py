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

    # 🔹 Lecture : tous les utilisateurs connectés
    if request.method == "GET":
        patients = Patient.objects.all()
        serializer = PatientSerializer(patients, many=True)
        return Response(serializer.data)

    # 🔒 Création : Admin ou Secrétaire
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

    # 🔹 Lecture : tous
    if request.method == "GET":
        rdv = RendezVous.objects.all()
        serializer = RendezVousSerializer(rdv, many=True)
        return Response(serializer.data)

    # 🔒 Création / modification : Admin ou Secrétaire
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
    """
    Retourne la liste des utilisateurs appartenant au groupe 'Medecin'
    """
    try:
        group = Group.objects.get(name="Medecin")
        medecins = User.objects.filter(groups=group)

        data = [
            {
                "id": user.id,
                "username": user.username,
                "prenom": user.first_name,
                "nom": user.last_name,
                "email": user.email,
            }
            for user in medecins
        ]

        return Response(data)

    except Group.DoesNotExist:
        return Response([])
