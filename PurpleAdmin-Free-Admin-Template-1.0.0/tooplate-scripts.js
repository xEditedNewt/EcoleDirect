async function data() {
  var username = localStorage.getItem("username");
  var password = localStorage.getItem("password");
  const payload = `data={ "identifiant": "${username}", "motdepasse": "${password}", "acceptationCharte": true }`;
  const options = {
      method: "POST",
      body: payload,
  };
  fetch('https://api.ecoledirecte.com/v3/login.awp', options)
  .then(response => response.json())
  .then(async (data) => {
      if(data.message != ""){
          document.getElementById("welcome").style.display = "none";
          document.getElementById("error").style.display = "block";
          document.getElementById("error").innerHTML = data.message;
      }
      else{
          id = data.data.accounts[0].id
          token = data.token
          note = await getNote(id,token)
      }
  })
  .catch(error => console.error(error));
  }

async function getNote(id,token){
payload = 'data={"token": "' + token + '"}'
const options = {
  method: "POST",
  body: payload,
};
fetch('https://api.ecoledirecte.com/v3/eleves/' + id + '/notes.awp?verbe=get&', options)
.then(response => response.json())
.then(async (data) => {
  document.getElementById("rangT1").style.display = "block";
  document.getElementById("rangT1").innerHTML = data.data.periodes[0].ensembleMatieres.rang;
  
  document.getElementById("rangT2").style.display = "block";
  document.getElementById("rangT2").innerHTML = data.data.periodes[1].ensembleMatieres.rang;
  document.getElementById("rangGlobal").style.display = "block";
  document.getElementById("rangGlobal").innerHTML = data.data.periodes[3].ensembleMatieres.rang;
  n_eleve = data.data.periodes[3].ensembleMatieres.effectif
  discipline = []
  global = []
  informations = [{option:[]},data.data.periodes[3].ensembleMatieres.rang,{matiere:[]}]
  id = 0
  data.data.periodes[3].ensembleMatieres.disciplines.forEach(element => {
    id = id + 1
    if(id==11 || id==10){
      informations[0].option.push(element.discipline)
    }
    if(element.discipline == "ENS. COMMUNS" || element.discipline == "ENS. OPTIONNELS"  || element.discipline == "ENS.DE SPECIALITE"){
          objet = {discipline: element.discipline, moyenne: element.moyenne.replace(/,/g, ".") , rang : element.rang, moyenneClasse: element.moyenneClasse.replace(/,/g, ".")}
          global.push(objet)
      }else{
      objet = {discipline: element.discipline, moyenne: element.moyenne.replace(/,/g, ".") , rang : element.rang,moyenneClasse: element.moyenneClasse.replace(/,/g, ".")}
      discipline.push(objet)
      informations[2].matiere.push(objet)
      }
  });
  //document.getElementById("note").style.display = "block";
  //document.getElementById("note").innerHTML = resulta;
  graph(discipline,global,Math.floor(n_eleve))
  getEcole(informations)
})
.catch(error => console.error(error));
}

async function graph(discipline,global,n_eleve){
const graph = await document.getElementById("graph");
const graphChart = new Chart(graph,{
type: 'radar',
data: {
labels: await discipline.map(row => row.discipline),
datasets: [
  {
    label: "Rang",
    fill: true,
    backgroundColor: "rgba(179,181,198,0.2)",
    borderColor: "rgba(179,181,198,1)",
    pointBorderColor: "#ffff",
    pointBackgroundColor: "rgba(179,181,198,1)",
    data: await discipline.map(row => row.rang)
  }, {
    label: "Moyenne",
    fill: true,
    backgroundColor: "rgba(255,99,132,0.2)",
    borderColor: "rgba(255,99,132,1)",
    pointBorderColor: "#fff",
    pointBackgroundColor: "rgba(255,99,132,1)",
    pointBorderColor: "#fff",
    data: await discipline.map(row => row.moyenne)
  },
  {
    label: "Moyenne Classe",
    fill: true,
    backgroundColor: "rgba(216, 236, 19,0.2)",
    borderColor: "rgba(216, 236, 19,1)",
    pointBorderColor: "#fff",
    pointBackgroundColor: "rgba(216, 236, 19,1)",
    pointBorderColor: "#fff",
    data: await discipline.map(row => row.moyenneClasse)
  }
]
},
options: {
  scales: {
      r: {
        suggestedMax: n_eleve,
        min: 0,
      }
  }
}
});
const graphh = await document.getElementById("graphh");
const graphhChart = new Chart(graphh,{
type: 'bar',
data: {
labels: await global.map(row => row.discipline),
datasets: [
  {
    label: "Rang",
    backgroundColor: "#3e95cd",
    data: await global.map(row => row.rang)
  }, {
    label: "Moyenne",
    backgroundColor: "#8e5ea2",
    data: await global.map(row => row.moyenne)
  }, {
      label: "Moyenne Classe",
      backgroundColor: "#08BD2E",
      data: await global.map(row => row.moyenneClasse)
    }
]
},
options: {
  scales: {
      y: {
          max: n_eleve,
          min:0
      }
  }
}
})
}


function putEcole(array) {
  const table = document.querySelector('.table tbody');

  array.forEach(item => {
    const tr = document.createElement('tr');
    const td1 = document.createElement('td');
    const td2 = document.createElement('td');
    const td3 = document.createElement('td');
  
    td1.textContent = item.ecole;
    td2.textContent = item.option;
    td3.textContent = item.minclassementGlobal;
  
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    table.appendChild(tr);
  });
}


async function getEcole(informations){
  ecole = [{ecole:"Université Paris Cité", option:["MATHEMATIQUES","NUMERIQUE SC.INFORM."], minclassementGlobal:15, mindiscipline:[{discipline:"PHILOSOPHIE",rang:9},{discipline :"MATHEMATIQUES",rang:12}]},
  {ecole:"ESTIAM", option:["MATHEMATIQUES","NUMERIQUE SC.INFORM."], minclassementGlobal:10, mindiscipline:[{discipline:"NUMERIQUE SC.INFORM.",rang:5},{discipline:"MATHEMATIQUES",rang:14}]},
  {ecole:"ESM", option:["MATHEMATIQUES","NUMERIQUE SC.INFORM."], minclassementGlobal:9, mindiscipline:[{discipline:"ENSEIGN.SCIENTIFIQUE",rang:27},{discipline:"MATHEMATIQUES",rang:12}]},
  {ecole:"SUPINFO", option:["MATHEMATIQUES","NUMERIQUE SC.INFORM."], minclassementGlobal:20, mindiscipline:[{discipline:"ENSEIGN.SCIENTIFIQUE",rang:21},{discipline:"MATHEMATIQUES",rang:25},{discipline:"NUMERIQUE SC.INFORM.",rang:14}]},
  {ecole:"ISEP", option:["MATHEMATIQUES","NUMERIQUE SC.INFORM."], minclassementGlobal:15, mindiscipline:[{discipline:"PHILOSOPHIE",rang:8},{discipline :"MATHEMATIQUES",rang:12}]},
  {ecole:"ESGI", option:["MATHEMATIQUES","NUMERIQUE SC.INFORM."], minclassementGlobal:15, mindiscipline:[{discipline:"ENSEIGN.SCIENTIFIQUE",rang:22},{discipline:"MATHEMATIQUES",rang:21},{discipline:"NUMERIQUE SC.INFORM.",rang:1}]},
  {ecole:"IPSSI", option:["MATHEMATIQUES","NUMERIQUE SC.INFORM."], minclassementGlobal:15, mindiscipline:[{discipline:"ENSEIGN.SCIENTIFIQUE",rang:7},{discipline:"MATHEMATIQUES",rang:10}]},
  {ecole:"YNOV", option:["MATHEMATIQUES","NUMERIQUE SC.INFORM."], minclassementGlobal:20, mindiscipline:[{discipline:"PHILOSOPHIE",rang:12},{discipline :"MATHEMATIQUES",rang:11}]},
  {ecole:"ECE", option:["MATHEMATIQUES","NUMERIQUE SC.INFORM."], minclassementGlobal:20, mindiscipline:[{discipline:"ENSEIGN.SCIENTIFIQUE",rang:17},{discipline:"MATHEMATIQUES",rang:14},{discipline:"NUMERIQUE SC.INFORM.",rang:3}]},
  {ecole:"ESILV", option:["MATHEMATIQUES","NUMERIQUE SC.INFORM."], minclassementGlobal:20, mindiscipline:[{discipline:"ENSEIGN.SCIENTIFIQUE",rang:18},{discipline:"MATHEMATIQUES",rang:22},{discipline:"NUMERIQUE SC.INFORM.",rang:8}]},
  {ecole:"EPF", option:["MATHEMATIQUES","NUMERIQUE SC.INFORM."], minclassementGlobal:20, mindiscipline:[{discipline:"ENSEIGN.SCIENTIFIQUE",rang:23},{discipline:"MATHEMATIQUES",rang:18},{discipline:"NUMERIQUE SC.INFORM.",rang:17}]},
  {ecole:"IIM", option:["MATHEMATIQUES","NUMERIQUE SC.INFORM."], minclassementGlobal:15, mindiscipline:[{discipline:"ENSEIGN.SCIENTIFIQUE",rang:25},{discipline:"MATHEMATIQUES",rang:24}]},
  {ecole:"Sciences PO", option:["MATHEMATIQUES","NUMERIQUE SC.INFORM."], minclassementGlobal:10, mindiscipline:[{discipline:"ENSEIGN.SCIENTIFIQUE",rang:15},{discipline:"MATHEMATIQUES",rang:16}]},
  {ecole:"Sorbonne", option:["MATHEMATIQUES","NUMERIQUE SC.INFORM."], minclassementGlobal:10, mindiscipline:[{discipline:"ENSEIGN.SCIENTIFIQUE",rang:11},{discipline:"MATHEMATIQUES",rang:27},{discipline:"NUMERIQUE SC.INFORM.",rang:2}]},
  {ecole:"Dauphine", option:["MATHEMATIQUES","NUMERIQUE SC.INFORM."], minclassementGlobal:8, mindiscipline:[{discipline:"ENSEIGN.SCIENTIFIQUE",rang:8},{discipline:"MATHEMATIQUES",rang:18},{discipline:"NUMERIQUE SC.INFORM.",rang:9}]},
  {ecole:"Sorbonne", option:["Literrature","Anglais"], minclassementGlobal:10, mindiscipline:[{discipline:"PHILOSOPHIE",rang:9}]},
  {ecole:"Université Paris Cité", option:["Literrature","Anglais"], minclassementGlobal:10, mindiscipline:[{discipline:"SES",rang:7}]},
  {ecole:"Dauphine", option:["Literrature","Anglais"], minclassementGlobal:10, mindiscipline:[{discipline:"SES",rang:12}]},
  {ecole:"Assas (Droit)", option:["Literrature","Histoire"], minclassementGlobal:15, mindiscipline:[{discipline:"Anglais",rang:18}]},
  {ecole:"Assas (eco)", option:["MATHEMATIQUES","SES"], minclassementGlobal:10, mindiscipline:[{discipline:"Anglais",rang:4}]},
]
  ecole_valide = []
  console.log(informations[2].matiere)
  ecole.forEach(async (element) => {
    i = 0
    if(element.option[0]== informations[0].option[0] && element.option[1]== informations[0].option[1]){
      i = i
    }
    else {i = i+1}
    if (element.minclassementGlobal >= informations[1]){
      i = i
    }
    else{
      i = i+1
    }
    if(compareArrays(element.mindiscipline,informations[2].matiere)){
      i = i
    }
    else{
      i = i+1
    }
    if(i == 0){
      ecole_valide.push(element)
    }
  })
  putEcole(ecole_valide)
}
















function compareArrays(array1, array2) {
  t = 0
  for (let i = 0; i < array1.length; i++){
    for (let j = 0; j < array2.length; j++) {
      if (array1[i].discipline === array2[j].discipline) {
        if (array1[i].rang >= array2[j].rang) {
          t = t
        }
        else{
          t = t+1
        }
      }
      else{
        t = t
      }
    }
  }
  if (t==0){
    return true
  }
  else{
    return false
  }
}

