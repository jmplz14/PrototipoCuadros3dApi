from django.db import models


# Create your models here.


class Color(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=200)
    codigo = models.CharField(max_length=7, default='#ffffff')

class Tipo(models.Model):
    id = models.AutoField(primary_key=True)
    icono = models.CharField(max_length=200)


class Cuadro(models.Model):
    id = models.AutoField(primary_key=True)
    altoTotal = models.FloatField()
    anchoTotal = models.FloatField()
    altoLamina = models.FloatField()
    anchoLamina = models.FloatField()
    idColor = models.ForeignKey(Color, on_delete=models.CASCADE)
    idTipo = models.ForeignKey(Tipo, on_delete=models.CASCADE)
    precio = models.FloatField()
    img = models.CharField(max_length=200)
    #fichero3D = models.CharField(max_length=200)
    #fichero3d = models.CharField(max_length=200)

