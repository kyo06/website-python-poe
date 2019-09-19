//lorsque le DOM est prêt
$( document ).ready(function() {
    //console.log( "ready!" );

    //Si le user n'est pas connecté alors on redirige vers login.html 
    if(!window.sessionStorage["connected"]) {
        window.location.href = "formulaire_login.html";
        return;
    }

    let payload = window.sessionStorage["payload"];
    payload = JSON.parse(payload);
    $('#display_login').html(payload.nom);

    $('#logout').on('click', function logout() {
        
        let token = window.sessionStorage["token"]
        window.sessionStorage.clear();

        //Blacklister le token JWT
        fetch(API_URL + '/logout', 
        { 
            method: 'GET', 
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if(response.status !== 200) {
                throw new Error(response.status)
            }
            window.location.href = "/";
        
            //return response.json();
        }).catch(function(error)
        {
          ///if status code 401...
          window.location.href = "/";
         
        });
                
    });

    fetch(API_URL + '/produits', 
        { 
            method: 'GET', 
            headers: {
                'Authorization': window.sessionStorage["token"],
                'Content-Type': 'application/json'
            }
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
          //NE PAS OUBLIER DE VIDER LE SESSION STORAGE
          window.sessionStorage.clear();

          $('#message').html('Pas authorisé, vous allez être redirigé...');
          $('#message').hide('slow', function() {
            window.location.href = "/";
          })
        });

});