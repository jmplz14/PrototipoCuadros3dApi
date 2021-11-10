from django.http import HttpResponse, FileResponse
from django.shortcuts import render, HttpResponse, get_object_or_404
import json
import os
import mimetypes
from .models import Color, Tipo

def visualizador(request):
    colores = Color.objects.all()
    
    
    tipos = Tipo.objects.all()
    return render(request,'index.html', {'colores': colores, 'tipos': tipos})

