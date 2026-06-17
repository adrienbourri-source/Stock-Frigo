# Le Garde-Manger — guide de déploiement

App d'inventaire frigo partagée pour toute la maison, en temps réel.
Gratuit, sans serveur à maintenir. Compte ~20 minutes la première fois.

Tu fais ça **une seule fois**. Ensuite chacun ouvre juste le lien.

---

## Ce que tu vas mettre en place

- **GitHub Pages** : héberge l'app (le lien que la famille ouvrira).
- **Firebase Firestore** : la base partagée. Quand quelqu'un ajoute un aliment,
  tous les autres téléphones le voient apparaître en direct.

Les deux sont gratuits et tu connais déjà GitHub.

---

## Étape 1 — Créer le projet Firebase

1. Va sur https://console.firebase.google.com
2. Clique **Ajouter un projet** (ou *Add project*).
3. Nomme-le par ex. `garde-manger-maison`. Tu peux refuser Google Analytics.
4. Attends la création, puis **Continuer**.

## Étape 2 — Créer la base Firestore

1. Dans le menu de gauche : **Création** > **Firestore Database**.
2. Clique **Créer une base de données**.
3. Choisis un emplacement européen (ex. `europe-west`).
4. Démarre en **mode test** (*Start in test mode*). On sécurisera juste après.
5. Clique **Activer**.

## Étape 3 — Régler les règles de sécurité

Le mode test expire au bout de 30 jours. Remplace les règles pour que ça dure,
tout en restant simple pour un usage familial.

1. Onglet **Règles** dans Firestore.
2. Colle ceci, puis **Publier** :

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /pantry/{doc} {
      allow read, write: if true;
    }
  }
}
```

> Honnêteté : `if true` veut dire que **quiconque connaît l'adresse de ta base
> peut lire/écrire**. Pour un frigo familial sans données sensibles, c'est un
> compromis raisonnable et c'est ce qui garde l'install simple. Si tu veux
> verrouiller plus tard (mot de passe, comptes), dis-le-moi, on ajoutera
> l'authentification.

## Étape 4 — Récupérer ta config et la coller dans l'app

1. Roue crantée **⚙️ > Paramètres du projet**.
2. Section **Vos applications**, clique l'icône **Web** `</>`.
3. Donne un surnom (`garde-manger`), **enregistre l'application**. Pas besoin de Hosting.
4. Firebase affiche un bloc `const firebaseConfig = { ... }`. Copie les valeurs.
5. Ouvre `index.html`, trouve le bloc marqué `FIREBASE_CONFIG` tout en haut du
   `<script>`, et remplace chaque `"À_REMPLACER"` par tes vraies valeurs.

Ça ressemblera à :

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "garde-manger-maison.firebaseapp.com",
  projectId: "garde-manger-maison",
  storageBucket: "garde-manger-maison.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};
```

> Ces clés ne sont pas des secrets : côté web Firebase elles sont publiques par
> conception. La vraie sécurité vient des règles de l'étape 3.

## Étape 5 — Mettre en ligne sur GitHub Pages

1. Crée un nouveau dépôt sur GitHub (ex. `garde-manger`), public.
2. Dépose les 3 fichiers à la racine : `index.html`, `manifest.json`, `sw.js`.
3. Dépôt > **Settings** > **Pages**.
4. Sous *Build and deployment*, source = **Deploy from a branch**,
   branche = `main`, dossier = `/ (root)`. **Save**.
5. Attends 1–2 min. GitHub affiche l'adresse, du type
   `https://adrienbourri-source.github.io/garde-manger/`

C'est **ce lien** que tu envoies à toute la maison.

## Étape 6 — Chacun l'installe sur son téléphone

Pour que ça ressemble à une vraie app (icône, plein écran, rappels) :

- **iPhone (Safari)** : ouvre le lien > bouton Partager > **Sur l'écran d'accueil**.
- **Android (Chrome)** : ouvre le lien > menu ⋮ > **Installer l'application** /
  **Ajouter à l'écran d'accueil**.

Au premier lancement, accepte les **rappels** pour recevoir une notification
par jour des aliments qui périment bientôt.

---

## Bon à savoir (les limites, sans enrobage)

- **Temps réel** : ajout/suppression apparaissent sur tous les téléphones en
  quelques secondes, sans rafraîchir. C'est le vrai gain par rapport à la version d'essai.
- **Rappels** : ce sont des notifications **locales**, déclenchées une fois par
  jour quand quelqu'un ouvre l'app. Pas un push qui sonne tout seul à 8h app fermée.
  Le push complet (heure fixe, app fermée) demande Firebase Cloud Messaging en plus,
  et reste capricieux sur iPhone. Dis-le-moi si tu veux qu'on l'ajoute.
- **Quotas gratuits Firebase** : largement au-dessus d'un usage familial
  (des dizaines de milliers de lectures/jour gratuites). Tu ne paieras rien.
- **Sécurité** : règles ouvertes (étape 3). Aucun donnée sensible dans un frigo,
  donc acceptable. Verrouillable plus tard.

## Si quelque chose cloche

- Page blanche avec « Config Firebase manquante » : l'étape 4 n'est pas finie,
  il reste des `À_REMPLACER` dans `index.html`.
- « Hors ligne — reconnexion » qui reste : vérifie les règles Firestore (étape 3)
  et que `projectId` est correct.
- Rien ne se synchronise entre deux téléphones : assure-toi qu'ils ouvrent
  exactement le **même lien** GitHub Pages.
