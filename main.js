/*
  Agora – TP1 : le catalogue des salles.

  Adresse de l'API Agora. Le backend doit tourner sur votre poste (voir README.md).
  Documentation de l'API (Swagger) : http://localhost:8080/docs

  Routes utiles pour cet écran :
    GET /salles       liste paginée des salles : { contenu, page, taille, total, totalPages }
    GET /quartiers    liste des quartiers
    GET /equipements  liste des équipements (code et libellé)

  Pour tester vos états de chargement, d'erreur et de liste vide, ajoutez temporairement
  l'en-tête X-Simulation (valeurs : lent, erreur, vide) à votre requête, ou le paramètre
  ?simulation=lent à l'adresse appelée. Retirez-le avant de rendre.
*/
const API_URL = "http://localhost:8080/api/agora";
