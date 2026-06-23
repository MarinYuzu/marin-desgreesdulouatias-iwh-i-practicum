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

// --- Route 1 : Homepage ---
// Récupère tous les enregistrements du custom object et les affiche dans un tableau
app.get('/', async (req, res) => {
  const url = `/crm/v3/objects/${CUSTOM_OBJECT_TYPE}?properties=${PROPERTIES.join(',')}`;
  try {
    const resp = await hubspot.get(url);
    const records = resp.data.results;
    res.render('homepage', {
      title: 'Homepage | Integrating With HubSpot I Practicum',
      records,
      properties: PROPERTIES,
    });
  } catch (e) {
    console.error(e.response ? e.response.data : e.message);
    res.status(500).send('Erreur lors de la récupération des enregistrements.');
  }
});

// --- Route 2 : Formulaire de création ---
// Affiche le formulaire pour créer un nouvel enregistrement
app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    title: 'Update Custom Object Form | Integrating With HubSpot I Practicum',
  });
});

// --- Route 3 : Création d'un enregistrement ---
// Reçoit les données du formulaire et crée un nouvel enregistrement dans HubSpot
app.post('/update-cobj', async (req, res) => {
  const newRecord = {
    properties: {
      name: req.body.name,
      origine: req.body.origine,
      poids_kg: req.body.poids_kg,
      n_de_serie: req.body.n_de_serie,
    },
  };
  try {
    await hubspot.post(`/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`, newRecord);
    res.redirect('/');
  } catch (e) {
    console.error(e.response ? e.response.data : e.message);
    res.status(500).send('Erreur lors de la création de l\'enregistrement.');
  }
});

// --- Démarrage du serveur ---
const PORT = 3000;
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));