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


@api_view(["GET", "POST", "PUT", "DELETE"])
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


    if request.method == "POST":
        serializer = PatientSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


    if request.method == "PUT":
        patient_id = request.data.get('id')
        if not patient_id:
            return Response({"detail": "ID du patient requis"}, status=400)

        try:
            patient = Patient.objects.get(id=patient_id)
        except Patient.DoesNotExist:
            return Response({"detail": "Patient non trouvé"}, status=404)

        serializer = PatientSerializer(patient, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


    if request.method == "DELETE":
        patient_id = request.data.get('id')
        if not patient_id:
            return Response({"detail": "ID du patient requis"}, status=400)

        try:
            patient = Patient.objects.get(id=patient_id)
            patient.delete()
            return Response({"message": "Patient supprimé avec succès"}, status=204)
        except Patient.DoesNotExist:
            return Response({"detail": "Patient non trouvé"}, status=404)


@api_view(["GET", "POST", "PUT", "PATCH", "DELETE"])
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


    if request.method == "PUT":
        rdv_id = request.data.get('id')
        if not rdv_id:
            return Response({"detail": "ID du rendez-vous requis"}, status=400)

        try:
            rdv = RendezVous.objects.get(id=rdv_id)
        except RendezVous.DoesNotExist:
            return Response({"detail": "Rendez-vous non trouvé"}, status=404)

        serializer = RendezVousSerializer(rdv, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


    if request.method == "PATCH":
        rdv_id = request.data.get('id')
        if not rdv_id:
            return Response({"detail": "ID du rendez-vous requis"}, status=400)

        try:
            rdv = RendezVous.objects.get(id=rdv_id)
            rdv.statut = request.data.get('statut', rdv.statut)
            rdv.save()
            return Response({"message": "Statut mis à jour"})
        except RendezVous.DoesNotExist:
            return Response({"detail": "Rendez-vous non trouvé"}, status=404)


    if request.method == "DELETE":
        rdv_id = request.data.get('id')
        if not rdv_id:
            return Response({"detail": "ID du rendez-vous requis"}, status=400)

        try:
            rdv = RendezVous.objects.get(id=rdv_id)
            rdv.delete()
            return Response({"message": "Rendez-vous supprimé avec succès"}, status=204)
        except RendezVous.DoesNotExist:
            return Response({"detail": "Rendez-vous non trouvé"}, status=404)


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
