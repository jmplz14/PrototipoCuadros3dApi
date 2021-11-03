from django.http import HttpResponse, FileResponse
from django.shortcuts import render, HttpResponse, get_object_or_404
import json
import os
import mimetypes


def visualizador(request):

    return render(request,'index.html', {})

