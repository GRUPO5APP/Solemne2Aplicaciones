from django.db import models
from django.utils import timezone
from datetime import timedelta


class Task(models.Model):
    STATUS_CHOICES = [
        ('Pendiente', 'Pendiente'),
        ('En progreso', 'En progreso'),
        ('Completada', 'Completada'),
        ('Vencida', 'Vencida'),
    ]

    PRIORITY_CHOICES = [
        ('Alta', 'Alta'),
        ('Media', 'Media'),
        ('Baja', 'Baja'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pendiente')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='Media')
    created_at = models.DateTimeField(auto_now_add=True)
    due_date = models.DateTimeField()

    def is_due_soon(self):
        if self.status in ['Completada', 'Vencida']:
            return False
        return timezone.now() + timedelta(hours=24) >= self.due_date

    def mark_as_vencida_if_needed(self):
        if timezone.now() > self.due_date and self.status not in ['Completada', 'Vencida']:
            self.status = 'Vencida'
            self.save()

    def clean(self):
        if self.due_date < timezone.now():
            from django.core.exceptions import ValidationError
            raise ValidationError('La fecha de vencimiento no puede estar en el pasado.')

    def __str__(self):
        return f"{self.title} ({self.status})"
