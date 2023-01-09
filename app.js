async function login() {
    
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    if (!username || !password) {
        // Affiche un message d'erreur
        document.getElementById("message").style.display = "block";
        document.getElementById("message").innerHTML = "Veuillez remplir tous les champs du formulaire";
        return;
      }
    const payload = `data={ "identifiant": "${username}", "motdepasse": "${password}", "acceptationCharte": true }`;
    const options = {
        method: "POST",
        body: payload,
    };
    fetch('https://api.ecoledirecte.com/v3/login.awp', options)
    .then(response => response.json())
    .then(async (data) => {
        if(data.message != ""){
            document.getElementById("message").style.display = "block";
            document.getElementById("message").innerHTML = data.message;
        }
        else{
            localStorage.setItem("username", username);
            localStorage.setItem("password", password);
            window.location.href = "acceuil.html";
        }
    })
    .catch(error => console.error(error));
    }
