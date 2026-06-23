// Charge les variables d'environnement depuis le fichier .env
require('dotenv').config();

// Importe les bibliothèques nécessaires
const express = require('express'); // Framework web pour créer les routes
const axios = require('axios');     // Bibliothèque pour faire des appels API

// Crée l'application Express
const app = express();

// --- Middleware ---
// Sert les fichiers statiques (CSS, images) depuis le dossier /public
app.use(express.static(__dirname + '/public'));
// Permet de lire les données envoyées depuis un formulaire HTML
app.use(express.urlencoded({ extended: true }));
// Définit Pug comme moteur de templates pour les vues HTML
app.set('view engine', 'pug');

// --- Configuration ---
// Récupère le token HubSpot depuis le fichier .env (jamais dans le code directement)
const PRIVATE_APP_TOKEN = process.env.PRIVATE_APP_TOKEN;
// Récupère l'identifiant du custom object depuis le fichier .env
const CUSTOM_OBJECT_TYPE = process.env.CUSTOM_OBJECT_TYPE;
// Liste des propriétés à récupérer depuis HubSpot
const PROPERTIES = ['name', 'origine', 'poids_kg', 'n_de_serie'];

// --- Client HubSpot ---
// Crée une instance Axios préconfigurée pour les appels à l'API HubSpot
const hubspot = axios.create({
  baseURL: 'https://api.hubapi.com',
  headers: {
    Authorization: `Bearer ${PRIVATE_APP_TOKEN}`, // Authentification avec le token
    'Content-Type': 'application/json',
  },
});

// --- Démarrage du serveur ---
const PORT = 3000;
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));