
const API_BASE = "http://localhost:8080/api/agora";

const formulaire = document.querySelector("#formulaire-filtres");
const selectQuartier = document.querySelector("#quartier");
const listeEquipements = document.querySelector("#liste-equipements");
const listeSalles = document.querySelector("#liste-salle");
const nombreSalles = document.querySelector("#nombres-salles");

let requeteEnCours = null;
let delaiRecherche = null;



function creerElement(balise, classe, texte) {
  const element = document.createElement(balise);

  if (classe) {
    element.classList.add(classe);
  }

  if (texte !== undefined && texte !== null) {
    element.textContent = texte;
  }

  return element;
}



async function chargerQuartiers() {
  try {
    const reponse = await fetch(`${API_BASE}/quartiers`);

    if (!reponse.ok) {
      throw new Error("Erreur lors du chargement des quartiers");
    }

    const quartiers = await reponse.json();

    selectQuartier.innerHTML = "";

    const optionDefaut = creerElement(
      "option",
      "",
      "Tous les quartiers"
    );

    optionDefaut.value = "";
    selectQuartier.appendChild(optionDefaut);

    quartiers.forEach((quartier) => {
      const option = creerElement(
        "option",
        "",
        quartier.nom
      );

      option.value = quartier.nom;

      selectQuartier.appendChild(option);
    });

  } catch (erreur) {
    console.error("Erreur quartiers :", erreur);

    selectQuartier.innerHTML = "";

    const optionErreur = creerElement(
      "option",
      "",
      "Impossible de charger les quartiers"
    );

    optionErreur.value = "";
    selectQuartier.appendChild(optionErreur);
  }
}



async function chargerEquipements() {
  try {
    const reponse = await fetch(`${API_BASE}/equipements`);

    if (!reponse.ok) {
      throw new Error("Erreur lors du chargement des équipements");
    }

    const equipements = await reponse.json();

    listeEquipements.innerHTML = "";

    equipements.forEach((equipement) => {
      const groupe = creerElement(
        "div",
        "option-equipement"
      );

      const checkbox = creerElement("input");

      checkbox.type = "checkbox";
      checkbox.name = "equipements";
      checkbox.value = equipement.code;
      checkbox.id = `equipement-${equipement.code}`;

      const label = creerElement(
        "label",
        "",
        equipement.libelle
      );

      label.htmlFor = checkbox.id;

      groupe.appendChild(checkbox);
      groupe.appendChild(label);

      listeEquipements.appendChild(groupe);
    });

    if (equipements.length === 0) {
      listeEquipements.textContent =
        "Aucun équipement disponible.";
    }

  } catch (erreur) {
    console.error("Erreur équipements :", erreur);

    listeEquipements.textContent =
      "Impossible de charger les équipements.";
  }
}


function construireParametres() {
  const parametres = new URLSearchParams();

  const recherche = formulaire.elements.q.value.trim();
  const quartier = formulaire.elements.quartier.value;
  const capacite = formulaire.elements.capaciteMin.value;

  if (recherche) {
    parametres.set("q", recherche);
  }

  if (quartier) {
    parametres.set("quartier", quartier);
  }

  if (capacite) {
    parametres.set("capaciteMin", capacite);
  }

  const equipementsSelectionnes = formulaire.querySelectorAll(
    'input[name="equipements"]:checked'
  );

  equipementsSelectionnes.forEach((checkbox) => {
    parametres.append("equipements", checkbox.value);
  });

  return parametres;
}



function afficherChargement() {
  nombreSalles.textContent = "Chargement des salles...";
  listeSalles.innerHTML = "";

  const message = creerElement(
    "p",
    "message-chargement",
    "Recherche des salles en cours..."
  );

  listeSalles.appendChild(message);
}


function afficherErreur() {
  nombreSalles.textContent =
    "Impossible de charger les salles.";

  listeSalles.innerHTML = "";

  const message = creerElement(
    "p",
    "message-erreur",
    "Une erreur est survenue lors du chargement des salles."
  );

  message.setAttribute("role", "alert");

  const bouton = creerElement(
    "button",
    "bouton-reessayer",
    "Réessayer"
  );

  bouton.type = "button";

  bouton.addEventListener("click", chargerSalles);

  listeSalles.appendChild(message);
  listeSalles.appendChild(bouton);
}



function traduireEquipement(code) {
  const traductions = {
    PMR: "Accès PMR",
    CUISINE: "Cuisine",
    VIDEOPROJECTEUR: "Vidéoprojecteur",
    SCENE: "Scène",
    PARKING: "Parking"
  };

  return traductions[code] || code;
}



function creerCarteSalle(salle) {
  const carte = creerElement(
    "article",
    "carte-salle"
  );



  const illustration = creerElement(
    "div",
    "illustration-salle"
  );

  const image = creerElement("img");

  image.src = "/icones/batiment.svg";
  image.alt = "";
  image.classList.add("image-salle");

  illustration.appendChild(image);



  const contenu = creerElement(
    "div",
    "contenu-carte-salle"
  );

  const titre = creerElement(
    "h2",
    "",
    salle.nom
  );

const quartier = creerElement("p", "quartier-salle");

const iconeLieu = document.createElement("img");
iconeLieu.src = "/icones/lieu.svg";
iconeLieu.alt = "";

const nomQuartier = creerElement("span", "", salle.quartier);

quartier.append(iconeLieu, nomQuartier);

const capacite = creerElement("p", "capacite-salle");

const iconePersonnes = document.createElement("img");
iconePersonnes.src = "/icones/personnes.svg";
iconePersonnes.alt = "";

const nombrePersonnes = creerElement(
  "span",
  "",
  `${salle.capacite} personnes`
);

capacite.append(iconePersonnes, nombrePersonnes);

  const surface = creerElement(
    "p",
    "information-salle",
    `Surface : ${salle.surface} m²`
  );

  const description = creerElement(
    "p",
    "description-salle",
    salle.description || "Aucune description disponible."
  );


  const titreEquipements = creerElement(
    "h3",
    "",
    "Équipements"
  );

  const liste = creerElement(
    "ul",
    "equipements-salle"
  );

  if (Array.isArray(salle.equipements)) {
    salle.equipements.slice(0, 3).forEach((equipement) => {
      const code = typeof equipement === "string"
        ? equipement
        : equipement.code;

      const element = creerElement(
        "li",
        "",
        traduireEquipement(code)
      );

      liste.appendChild(element);
    });
  }



  const informationTarif = creerElement(
    "p",
    "information-tarif",
    "Gratuit pour les associations de Montvert"
  );

  const tarif = creerElement(
    "p",
    "tarif-salle",
    `${salle.tarifHoraire} €/h hors Montvert`
  );



  const lien = creerElement(
    "a",
    "bouton-voir-salle",
    `Voir la salle`
  );

  lien.href = `/salles/${salle.id}`;



  contenu.appendChild(titre);
  contenu.appendChild(quartier);
  contenu.appendChild(capacite);
  contenu.appendChild(surface);
  contenu.appendChild(description);
  contenu.appendChild(titreEquipements);
  contenu.appendChild(liste);
  contenu.appendChild(informationTarif);
  contenu.appendChild(tarif);
  contenu.appendChild(lien);
  

  carte.appendChild(illustration);
  carte.appendChild(contenu);

  return carte;
}



function afficherSalles(donnees) {
  listeSalles.innerHTML = "";

  const salles = donnees.contenu;

  if (!Array.isArray(salles) || salles.length === 0) {
    nombreSalles.textContent = "Aucune salle trouvée.";

    const message = creerElement(
      "p",
      "message-vide",
      "Aucune salle ne correspond à votre recherche."
    );

    const bouton = creerElement(
      "button",
      "bouton-reinitialiser",
      "Réinitialiser les filtres"
    );

    bouton.type = "button";

    bouton.addEventListener(
      "click",
      reinitialiserFiltres
    );

    listeSalles.appendChild(message);
    listeSalles.appendChild(bouton);

    return;
  }

  nombreSalles.textContent =
    `${donnees.total} salle(s) trouvée(s)`;

  salles.forEach((salle) => {
    const carte = creerCarteSalle(salle);

    listeSalles.appendChild(carte);
  });
}



async function chargerSalles() {
  if (requeteEnCours) {
    requeteEnCours.abort();
  }

  requeteEnCours = new AbortController();

  afficherChargement();

  const parametres = construireParametres();

  const url = new URL(`${API_BASE}/salles`);

  url.search = parametres.toString();

  try {
    const reponse = await fetch(url, {
      signal: requeteEnCours.signal
    });

    if (!reponse.ok) {
      throw new Error(
        "Erreur lors du chargement des salles"
      );
    }

    const donnees = await reponse.json();

    afficherSalles(donnees);

  } catch (erreur) {
    if (erreur.name === "AbortError") {
      return;
    }

    console.error("Erreur API salles :", erreur);

    afficherErreur();
  }
}



function reinitialiserFiltres() {
  formulaire.reset();
  chargerSalles();
}




formulaire.addEventListener("submit", (evenement) => {
  evenement.preventDefault();
  chargerSalles();
});


formulaire.addEventListener("change", () => {
  chargerSalles();
});


formulaire.elements.q.addEventListener("input", () => {
  clearTimeout(delaiRecherche);

  delaiRecherche = setTimeout(() => {
    chargerSalles();
  }, 300);
});


formulaire.addEventListener("reset", () => {
  setTimeout(() => {
    chargerSalles();
  }, 0);
});



async function initialiserPage() {
  await Promise.all([
    chargerQuartiers(),
    chargerEquipements()
  ]);

  await chargerSalles();
}

initialiserPage();
