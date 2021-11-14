from django.http import HttpResponse, FileResponse
from django.shortcuts import render, HttpResponse, get_object_or_404
import json
import os
import mimetypes
from .models import Color, Tipo, Cuadro
from django.core import serializers

def visualizador(request):
    colores = Color.objects.all()
    colores = serializers.serialize("json", colores)
    tipos = Tipo.objects.all()
    tipos = serializers.serialize("json", tipos)
    cuadros = Cuadro.objects.all()
    cuadros = serializers.serialize("json", cuadros)
    return render(request,'index.html', {'colores': colores, 'tipos': tipos, 'cuadros': cuadros})

