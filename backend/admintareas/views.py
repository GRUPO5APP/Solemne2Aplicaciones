from django.shortcuts import render
from rest_framework import viewsets
from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def perform_update(self, serializer):
        instance = serializer.save()
        instance.mark_as_vencida_if_needed()

    def perform_create(self, serializer):
        task = serializer.save()
        task.mark_as_vencida_if_needed()

