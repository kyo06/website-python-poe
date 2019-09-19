//lorsque le DOM est prêt
$( document ).ready(function() {
    //console.log( "ready!" );

    //Si le user n'est pas connecté alors on redirige vers login.html 
    if(!window.sessionStorage["connected"]) {
        window.location.href = "formulaire_login.html";
        return;
    }

    $('#submitAjoutProduit').on('click', function submitAjoutProduit() {

        fetch(API_URL + '/produits', 
        { 
            method: 'POST', 
            headers: {
                'Authorization': window.sessionStorage["token"],
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'login': login, 
                'password': password
            })
        }).then(response => {
            if(response.status !== 200) {
                throw new Error(response.status)
            }
            return response.json();
        })
        .then(listProduits => { 
            console.log(listProduits);
            for(let i = 0; i < listProduits.length; i++) {
                let produit = listProduits[i];
                let ligne_produit_html = `<tr align="center">
                <td>` + produit.nom + `</td>
                <td><img width="50px" height="50px" src="/uploads/` + produit.image + `" /></td>
                <td>` + produit.qty + `</td>
                <td>` + produit.prix + `</td>
                <td>` + produit.qty * produit.prix + `</td>
                <td><a href="/formulaire_modifier_produit.html?id=` + produit.id + `">Modifier</a></td>                
                <td><a href="#" id="supprimerProduit" data="` + produit.id + `">Supprimer</a></td>            
                </tr>`;   
                $('#tableProduits').append(ligne_produit_html);
            }
        }).catch(function(error)
        {
          ///if status code 401...
          $('#message').html('Pas authorisé');
        });

    });



});