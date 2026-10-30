# Agora – TP1 : intégrer le catalogue des salles

Code de départ du TP1 du module M02. Un projet Vite en JavaScript, sans framework : vous écrivez le HTML, le CSS et le JavaScript de l'écran « Trouver une salle ».

## Contenu

| Fichier ou dossier | Rôle |
|---|---|
| `index.html` | La page, vide. Les liens vers la police, `style.css` et `main.js` sont déjà en place |
| `style.css` | Les variables de la charte Agora, déjà déclarées dans `:root`. Vos règles viennent à la suite |
| `main.js` | L'adresse de l'API (`API_URL`). Votre code JavaScript vient à la suite |
| `.htmlvalidate.json` | Les règles du validateur HTML, lancé par `npm run valider` |
| `public/icones/` | Les icônes de la maquette en SVG (trait de 2 px, couleur `currentColor`) |
| `maquettes/` | Les maquettes mobile et desktop et la planche des composants. Inutile de les joindre à votre rendu |

## 1. Installer

Prérequis : Node.js 22 ou 24, Docker Desktop.

```bash
cd basecode-agora-tp1
npm install
```

Versionnez votre travail dès le départ :

```bash
git init
git add .
git commit -m "Code de départ du TP1"
```

## 2. Lancer le backend Agora

Dans un autre terminal :

```bash
docker run --rm -p 8080:8080 lennylouis/agora-api:latest
```

Vérifiez dans le navigateur :

- `http://localhost:8080/docs` : le Swagger, choisissez l'API Agora dans la barre du haut,
- `http://localhost:8080/api/agora/salles` : la première page des salles, en JSON.

Les données sont en mémoire et repartent de zéro à chaque démarrage.

## 3. Lancer le projet

```bash
npm run dev
```

Ouvrez `http://localhost:5173`. La page se recharge à chaque enregistrement.

Pour valider votre HTML à tout moment :

```bash
npm run valider
```

Gardez le port 5173 : l'API n'accepte les appels du navigateur (CORS) que depuis `http://localhost:5173` et `http://localhost:4173`.

## 4. Tester les états de l'écran

L'API sait simuler un réseau lent, une panne ou une liste vide. Ajoutez à votre requête vers `/salles` l'en-tête `X-Simulation` ou le paramètre `simulation` :

| Valeur | Effet |
|---|---|
| `lent` | La réponse arrive après 2 s : vous voyez votre état de chargement |
| `erreur` | L'API répond 500 : vous voyez votre état d'erreur |
| `vide` | L'API renvoie une liste vide : vous voyez votre état « aucune salle » |

Exemple : `http://localhost:8080/api/agora/salles?simulation=lent`. Retirez la simulation avant de rendre.

## 5. Rendre

Archive `NOM-Prenom-TP1-M02.zip` déposée sur Campus Connect, **sans le dossier `node_modules`**, avec le dossier `.git` et vos deux captures d'écran (voir l'énoncé).
