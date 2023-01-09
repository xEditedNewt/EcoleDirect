
var current = null;
document.querySelector('#username').addEventListener('focus', function(e) {
  if (current) current.pause();
  current = anime({
    targets: 'path',
    strokeDashoffset: {
      value: 0,
      duration: 700,
      easing: 'easeOutQuart'
    },
    strokeDasharray: {
      value: '240 1386',
      duration: 700,
      easing: 'easeOutQuart'
    }
  });
});
document.querySelector('#password').addEventListener('focus', function(e) {
  if (current) current.pause();
  current = anime({
    targets: 'path',
    strokeDashoffset: {
      value: -336,
      duration: 700,
      easing: 'easeOutQuart'
    },
    strokeDasharray: {
      value: '240 1386',
      duration: 700,
      easing: 'easeOutQuart'
    }
  });
});
document.querySelector('#submit').addEventListener('focus', function(e) {
  if (current) current.pause();
  current = anime({
    targets: 'path',
    strokeDashoffset: {
      value: -730,
      duration: 700,
      easing: 'easeOutQuart'
    },
    strokeDasharray: {
      value: '530 1386',
      duration: 700,
      easing: 'easeOutQuart'
    }
  });
});
document.querySelector('#submit').addEventListener("click",function(e) {
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
          window.location.href = "PurpleAdmin-Free-Admin-Template-1.0.0/index.html";
      }
  })
  .catch(error => console.error(error));
});