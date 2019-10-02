from django.http import HttpResponse

from ..models import Product

from django.shortcuts import render

def index(request):
    return HttpResponse('Hello World !')

def contact(request):
    return HttpResponse('Voici mon contact !')    

def formulaire(request):
    return render(request, 'produits/formulaire.html', {})


def add_produit(request):
    if request.method == "POST":
        print(request.POST)
        Product.objects.create(
            title = request.POST['title'],
            image_url = request.POST['image_url'],
            price = request.POST['price'],
            qty = request.POST['qty']            
        )
        
        return HttpResponse('OK !')
    else:
        return HttpResponse('Bad request !')

