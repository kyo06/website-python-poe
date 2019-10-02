from django.http import HttpResponse

from django.shortcuts import render

def index(request):
    return HttpResponse('Hello World !')

def contact(request):
    return HttpResponse('Voici mon contact !')    

def formulaire(request):
    return render(request, 'blog/formulaire.html', {})
