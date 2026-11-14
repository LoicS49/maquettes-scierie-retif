/* Scierie Rétif — maquette de l'espace pro (14/11/2026).
   Une seule page, chaque rubrique a son adresse (#demandes, #tarifs…), sur la coque commune des espaces pro :
   les modules du devis dans le menu, et un onglet « Modules » pour en ajouter d'autres. Pas de gestion du stock.
   Données de la scierie : donnees.js (relevées sur leur site). Les demandes, les noms et les chiffres sont des exemples. */
(function(){
'use strict';
var D = window.RetifDonnees, I = D.INFOS;
var REDUIT = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Petits outils ---------- */
function fmt(n){ var p = n.toFixed(2).split('.'); return p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ',' + p[1]; }
function eur(n){ return fmt(n) + '&nbsp;€'; }
function ent(n){ return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
function esc(s){ return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function maj(s){ return s.charAt(0).toUpperCase() + s.slice(1); }
function sec(id){ return id.replace('x', '×'); }
function $(s, r){ return (r || document).querySelector(s); }
function $$(s, r){ return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

var IC = {
  maison:'<path d="M3 11 12 4l9 7"/><path d="M5 9.5V20h14V9.5"/><path d="M10 20v-6h4v6"/>',
  liste:'<path d="M9 6h11M9 12h11M9 18h11"/><path d="M3.5 6l1.2 1.2L7 4.8M3.5 12l1.2 1.2L7 10.8M3.5 18l1.2 1.2L7 16.8"/>',
  catalogue:'<path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z"/><path d="M3 7.5 12 12l9-4.5M12 12v9"/>',
  modules:'<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><path d="M17 13.5v7M13.5 17h7"/>',
  tarif:'<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.5"/>',
  page:'<path d="M6 3h8l5 5v13H6z"/><path d="M14 3v5h5M9 13h7M9 17h5"/>',
  photo:'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="m21 16-5-5-8 8"/>',
  infos:'<path d="M3 21h18M5 21V8l7-4 7 4v13"/><path d="M9 21v-4h6v4M9 11h.01M15 11h.01"/>',
  stats:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  comptes:'<circle cx="9" cy="8" r="3.2"/><path d="M3 20c.6-3.4 3-5.4 6-5.4s5.4 2 6 5.4"/><path d="M16 4.6a3.2 3.2 0 0 1 0 6.2M18 14.8c1.6.8 2.6 2.6 3 5.2"/>',
  'import':'<path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 17v3h16v-3"/>',
  calcul:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 18h.01M12 18h4"/>',
  conseils:'<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
  avis:'<path d="m12 3 2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8l-5.4 2.9 1.1-6.1L3.2 9.4l6.1-.8z"/>',
  annonce:'<path d="M4 10v4h3l6 4V6L7 10z"/><path d="M16.5 9a4 4 0 0 1 0 6M19 6.5a7.5 7.5 0 0 1 0 11"/>',
  panier:'<path d="M3 4h2l2.4 10.5h10.2L20 7H6.2"/><circle cx="9" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/>',
  client:'<circle cx="12" cy="8" r="3.5"/><path d="M4.5 20c.8-4 3.8-6 7.5-6s6.7 2 7.5 6"/>',
  etapes:'<circle cx="6" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><path d="M6 8v8M10 6h10M10 18h10M10 12h6"/>',
  cadeau:'<rect x="3.5" y="8" width="17" height="4" rx="1"/><path d="M5 12v8h14v-8M12 8v12"/><path d="M12 8C10.5 5 7 4.5 7 6.8 7 8 9.5 8 12 8zm0 0c1.5-3 5-3.5 5-1.2C17 8 14.5 8 12 8z"/>',
  calendrier:'<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  repeter:'<path d="M17 2.5 20 5.5l-3 3"/><path d="M4 11.5v-1a5 5 0 0 1 5-5h11"/><path d="M7 21.5 4 18.5l3-3"/><path d="M20 12.5v1a5 5 0 0 1-5 5H4"/>',
  cadenas:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7.5a4 4 0 0 1 8 0V11"/>',
  emploi:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8.5 7V5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2M3 12.5h18"/>',
  bulle:'<path d="M4 5h16v11H8l-4 4z"/><path d="M8 9h8M8 12h5"/>',
  partage:'<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  etincelle:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
  pin:'<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>',
  lien:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 7 8.5-7"/>',
  menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
  fermer:'<path d="M6 6l12 12M18 6 6 18"/>',
  externe:'<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v6H4V6h6"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  envoi:'<path d="M4 12 20 4l-6 16-3-7z"/><path d="m11 13 9-9"/>',
  tel:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  imprimer:'<path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/>'
};
function svg(k){ return '<svg viewBox="0 0 24 24" aria-hidden="true">' + IC[k] + '</svg>'; }

/* ---------- Menu : les modules du devis. Les modules en plus sont dans l'onglet « Modules » ---------- */
var MENU = [
  {r:'tableau-de-bord', t:'Tableau de bord', ic:'maison'},
  {r:'demandes', t:'Demandes', titre:'Demandes «&nbsp;Ma liste&nbsp;»', ic:'liste', compte:true},
  {r:'catalogue', t:'Catalogue', ic:'catalogue'},
  {r:'tarifs', t:'Tarifs', ic:'tarif'},
  {r:'pages', t:'Pages du site', ic:'page'},
  {r:'photos', t:'Photothèque', ic:'photo'},
  {r:'infos', t:'Infos de la scierie', ic:'infos'},
  {r:'statistiques', t:'Statistiques', ic:'stats'},
  {r:'comptes', t:'Comptes', ic:'comptes'},
  {r:'modules', t:'Modules', ic:'modules', sep:true}
];
var OPTIONS = [
  {r:'import', g:'vendre', reco:true, t:'Import du tarif', titre:'Import automatique du tarif', prix:600, ic:'import', court:'Vous déposez votre fichier de tarifs et vous publiez vous-même les nouveaux prix, tout de suite.',
    intro:'Vous déposez votre fichier de tarifs. Le site lit les prix, vous montre ceux qui changent, et vous publiez vous-même, tout de suite.',
    pts:['C’est en ligne en deux minutes, sans attendre la mise à jour.', 'Les oublis sont repérés avant la publication : un prix vide, une longueur en trop.', 'Le site et «&nbsp;Ma liste&nbsp;» passent aux nouveaux prix en même temps.']},
  {r:'calculateur', g:'vendre', reco:true, t:'Calculateur', titre:'Calculateur de terrasse et de solivage', prix:500, ic:'calcul', court:'Vos clients entrent les dimensions de leur terrasse : sections, entraxe et quantités partent dans «&nbsp;Ma liste&nbsp;».',
    intro:'Votre client entre les dimensions de sa terrasse ou de son plancher. Le site lui propose les sections, l’entraxe et les quantités, d’après votre guide «&nbsp;Planchers courants&nbsp;», et tout part dans «&nbsp;Ma liste&nbsp;».',
    pts:['Moins de questions au téléphone sur les sections et l’entraxe.', 'Des listes plus complètes, qui arrivent prêtes à chiffrer.', 'Vos règles de pro, appliquées à chaque calcul.']},
  {r:'conseils', g:'connaitre', reco:true, t:'Conseils', titre:'Rubrique Conseils', prix:200, ic:'conseils', court:'Vos guides de pro en clair, trouvés sur Google, avec un lien vers les bons produits.',
    intro:'Vos guides de pro, en clair : choisir ses sections, préparer sa terrasse, choisir son bois et le faire durer. Chaque guide renvoie vers les bons produits.',
    pts:['Vos conseils, trouvés sur Google par ceux qui préparent un chantier.', 'Un lien vers le guide suffit à répondre à une question qui revient souvent.']},
  {r:'avis', g:'connaitre', reco:true, t:'Avis Google', titre:'Demande d’avis Google', prix:350, ic:'avis', court:'Après chaque commande retirée, un mail invite le client à laisser un avis sur votre fiche Google.',
    intro:'Quand une commande est marquée «&nbsp;retirée&nbsp;», le client reçoit un mail de remerciement avec un lien direct vers votre fiche Google.',
    pts:['Plus d’avis, sans avoir à y penser.', 'Un seul mail par commande, jamais de relance.']},
  {r:'annonces', g:'connaitre', reco:true, t:'Annonces', titre:'Annonces et fermetures', prix:150, ic:'annonce', court:'Un bandeau en haut du site pour une fermeture ou une bonne affaire, aux dates choisies.',
    intro:'Un bandeau en haut du site pour une fermeture exceptionnelle, les sapins de Noël ou une bonne affaire. Il s’affiche et s’efface tout seul aux dates choisies.',
    pts:['Pendant une fermeture, le site affiche tout seul «&nbsp;Fermé&nbsp;» et la date de réouverture.', 'Vos annonces se préparent à l’avance.']},
  /* Le reste du catalogue de la base commune, quand il a du sens pour une scierie (prix du catalogue du 14/11/2026) */
  {r:'retrait', g:'vendre', titre:'Commande à retirer', prix:500, ic:'panier', court:'Le client choisit son jour et son heure de retrait, et peut laisser un acompte en ligne.'},
  {r:'espace-client', g:'vendre', titre:'Espace client', prix:500, ic:'client', court:'Chaque client retrouve ses listes, ses devis et ses factures au même endroit.'},
  {r:'projet', g:'vendre', titre:'Demande de projet par étapes', prix:300, ic:'etapes', court:'Le formulaire pose les bonnes questions : type de projet, dimensions, délai, photos.'},
  {r:'bons-cadeaux', g:'vendre', titre:'Bons cadeaux', prix:400, ic:'cadeau', court:'Payés par carte, envoyés en PDF avec un code, validés au comptoir.'},
  {r:'rendez-vous', g:'vendre', titre:'Prise de rendez-vous', prix:500, ic:'calendrier', court:'Vos créneaux libres en ligne, avec la confirmation et un rappel par SMS.'},
  {r:'ateliers', g:'vendre', titre:'Ateliers et stages', prix:450, ic:'comptes', court:'Les dates, les places, l’acompte et la liste des inscrits.'},
  {r:'abonnements', g:'vendre', titre:'Abonnements', prix:500, ic:'repeter', court:'Une commande qui revient chaque mois, payée tous les mois.'},
  {r:'pages-avancees', g:'gerer', titre:'Gestion avancée des pages', prix:350, ic:'page', court:'L’historique complet, de nouvelles pages, et le texte que Google affiche pour chaque page.'},
  {r:'rappels', g:'gerer', titre:'Rappels de saison', prix:450, ic:'repeter', court:'Vos clients s’inscrivent, et un rappel part tout seul chaque année, par exemple pour le bois de chauffage.'},
  {r:'planning', g:'gerer', titre:'Planning de l’équipe', prix:500, ic:'calendrier', court:'Qui fait quoi, et quand, dans l’espace pro.'},
  {r:'galerie', g:'gerer', titre:'Galerie privée par client', prix:350, ic:'cadenas', court:'Des photos partagées avec un seul client, par exemple pour une commande sur mesure.'},
  {r:'recrutement', g:'gerer', titre:'Recrutement', prix:250, ic:'emploi', court:'Vos offres d’emploi et d’apprentissage, visibles dans Google, avec une candidature depuis le téléphone.'},
  {r:'avis-espace', g:'connaitre', titre:'Avis Google dans l’espace pro', prix:450, ic:'bulle', court:'Vos avis Google affichés ici, avec une réponse proposée.'},
  {r:'reseaux', g:'connaitre', titre:'Publication sur Instagram et Facebook', prix:500, ic:'partage', court:'Une réalisation ou une bonne affaire publiée aussi sur vos réseaux, en un clic.'},
  {r:'google-posts', g:'connaitre', titre:'Publications sur Google et Bing', prix:500, ic:'globe', court:'Vos réalisations et vos annonces publiées aussi sur votre fiche Google et sur Bing.'},
  {r:'redaction-ia', g:'connaitre', titre:'Rédaction assistée par IA', prix:500, ic:'etincelle', court:'Le texte d’une réalisation proposé à partir des photos et de quelques mots.'},
  {r:'rapport', g:'connaitre', titre:'Rapport de visibilité du mois', prix:450, ic:'stats', court:'Chaque mois, un résumé des recherches Google et des visites.'},
  {r:'villes', g:'connaitre', titre:'Pages par ville', prix:150, unite:'HT par page', ic:'pin', court:'Une page pour une ville d’où viennent beaucoup de vos clients.'},
  {r:'parrainage', g:'connaitre', titre:'Parrainage', prix:300, ic:'lien', court:'Chaque client content reçoit un lien à partager, et vous savez qui vous a recommandé.'},
  {r:'lettre', g:'connaitre', titre:'Lettre d’infos', prix:300, ic:'mail', court:'Les clients qui le veulent reçoivent vos nouveautés et vos bonnes affaires par e-mail.'},
  {r:'agenda', g:'connaitre', titre:'Agenda', prix:150, ic:'calendrier', court:'Les salons, foires et portes ouvertes où vous trouver.'}
];
var ONGLETS = [['reco', 'Recommandés'], ['tous', 'Tous'], ['vendre', 'Vendre'], ['gerer', 'Gérer'], ['connaitre', 'Se faire connaître'], ['actifs', 'Déjà actifs']];
var onglet = 'reco';

/* ---------- Demandes «  Ma liste » (exemples, prix du tarif de juin 2026) ---------- */
var STATUTS = ['Nouvelle', 'Devis envoyé', 'Payée', 'Prête', 'Retirée'];
var TONS = ['b-info', 'b-att', 'b-ok', 'b-noir', ''];
var ACTIONS = ['J’ai envoyé le devis', 'Paiement reçu', 'Commande prête : prévenir {p}', 'Marquer comme retirée'];
var MESSAGES = ['Demande n° {n} : le devis est noté comme envoyé.', 'Paiement noté : la commande passe en préparation.', 'Mail envoyé à <b>{p}</b> : sa commande l’attend.', 'Commande retirée, rangée dans l’historique.'];
var DEMANDES = [
  {id:1042, nom:'Thomas R.', type:'Particulier', ville:'Beaucouzé', quand:'aujourd’hui à 9 h 12', statut:0, retrait:'samedi matin', tel:'06 •• •• •• 31', note:'C’est pour l’ossature d’un abri de jardin. Je viens avec mon attelage.', lignes:[['63x175', '4,00', 10], ['50x75', '3,00', 20]]},
  {id:1041, nom:'Marc L.', type:'Artisan charpentier', ville:'Cholet', quand:'aujourd’hui à 8 h 05', statut:1, retrait:'par transporteur', tel:'06 •• •• •• 58', lignes:[['75x225', '6,00', 8], ['100x100', '3,00', 12]]},
  {id:1040, nom:'Claire B.', type:'Particulier', ville:'Avrillé', quand:'hier à 17 h 40', statut:2, retrait:'jeudi après-midi', tel:'06 •• •• •• 12', lignes:[['27x200', '4,00', 25]]},
  {id:1039, nom:'Julie P.', type:'Particulier', ville:'Angers', quand:'hier à 11 h 02', statut:3, retrait:'vendredi matin', tel:'07 •• •• •• 46', lignes:[['150x150', '3,00', 4], ['100x100', '2,50', 6]]},
  {id:1038, nom:'Paul D.', type:'Particulier', ville:'Saint-Jean-de-Linières', quand:'mardi à 15 h 30', statut:4, retrait:'mardi après-midi', tel:'06 •• •• •• 07', lignes:[['35x200', '4,00', 30], ['50x75', '4,00', 14]]}
];
var PRIX = {}; D.TARIF.forEach(function(t){ PRIX[t[0]] = t[1]; });
var NOMS_SEC = {}; D.SECTIONS.forEach(function(s){ NOMS_SEC[s.id] = s.nom; });
function trouver(id){ return DEMANDES.filter(function(d){ return d.id === id; })[0]; }
function lignesDe(d){ return d.lignes.map(function(l){ var p = PRIX[l[0]][l[1]]; return {sec:l[0], lg:l[1], q:l[2], p:p, t:p * l[2]}; }); }
function totalDe(d){ return lignesDe(d).reduce(function(a, l){ return a + l.t; }, 0); }
function poidsDe(d){ return d.lignes.reduce(function(a, l){ var wh = l[0].split('x'); return a + l[2] * wh[0] / 1000 * wh[1] / 1000 * parseFloat(l[1].replace(',', '.')) * 530; }, 0); }
function prenom(d){ return d.nom.split(' ')[0]; }
function puce(s){ return '<span class="badge ' + TONS[s] + '">' + STATUTS[s] + '</span>'; }
function nouvelles(){ return DEMANDES.filter(function(d){ return d.statut === 0; }).length; }
var FILTRES = [['toutes', 'Toutes', function(){ return true; }], ['a-traiter', 'À traiter', function(d){ return d.statut === 0; }], ['en-cours', 'En cours', function(d){ return d.statut > 0 && d.statut < 4; }], ['retirees', 'Retirées', function(d){ return d.statut === 4; }]];
var filtre = 'toutes';

/* ---------- Ouvert ou fermé, calculé avec les horaires ---------- */
var JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
var SEMAINE = [[8, 13], [14, 18]];
var PLAGES = {0:[], 1:SEMAINE, 2:SEMAINE, 3:SEMAINE, 4:SEMAINE, 5:SEMAINE, 6:[[8, 12]]};
function etat(d){
  var j = d.getDay(), h = d.getHours() + d.getMinutes() / 60, i, k, m, p;
  for (i = 0; i < PLAGES[j].length; i++){ if (h >= PLAGES[j][i][0] && h < PLAGES[j][i][1]) return {ouvert:true, txt:'Ouvert · ferme à ' + PLAGES[j][i][1] + ' h'}; }
  for (k = 0; k < 8; k++){
    p = PLAGES[(j + k) % 7];
    for (m = 0; m < p.length; m++){ if (k > 0 || p[m][0] > h) return {ouvert:false, txt:'Fermé · ouvre ' + (k === 0 ? 'à ' : k === 1 ? 'demain à ' : JOURS[(j + k) % 7] + ' à ') + p[m][0] + ' h'}; }
  }
  return {ouvert:false, txt:'Fermé'};
}
function blocEtat(){ var e = etat(new Date()); return '<p class="etat' + (e.ouvert ? '' : ' ferme') + '"><i></i>' + e.txt + '</p>'; }

/* ---------- Gabarits communs ---------- */
function tete(titre, sur, actions){
  return '<header class="ep-head"><div><p class="ep-eyebrow">' + (sur || '') + '</p><h1>' + titre + '</h1></div>' + (actions ? '<div class="ep-actions">' + actions + '</div>' : '') + '</header>';
}
function panneau(titre, corps, lien, cls){
  return '<section class="panel' + (cls ? ' ' + cls : '') + '"><div class="panel-h"><h2>' + titre + '</h2>' + (lien || '') + '</div>' + corps + '</section>';
}
function aujourdhui(){ return maj(new Date().toLocaleDateString('fr-FR', {weekday:'long', day:'numeric', month:'long'})); }
var VOIR_SITE = '<a class="btn btn-blanc" href="index.html" target="_blank" rel="noopener">Voir le site ' + svg('externe') + '</a>';

/* ---------- Tableau de bord ---------- */
var MODIFS = [
  ['Texte de la page «&nbsp;La scierie&nbsp;»', 'Bureau', 'hier à 16 h 20', '#pages/la-scierie'],
  ['3 photos de chantier ajoutées', 'Dépôt, depuis le téléphone', 'mardi', '#photos'],
  ['Produit masqué : Premier choix remisé', 'Bureau', 'lundi', '#catalogue/affaires'],
  ['Tarif Douglas brut mis en ligne', 'Loïc, maintenance', 'le 24 juin', '#tarifs']
];
function ligneDemande(d, cur){
  return '<li><a class="ligne" href="#demandes/' + d.id + '"' + (cur ? ' aria-current="true"' : '') + '><span class="qui"><b>' + d.nom + ' · ' + d.ville + '</b><small>n° ' + d.id + ' · ' + d.quand + '</small></span><span class="mt">' + eur(totalDe(d)) + '<br>' + puce(d.statut) + '</span></a></li>';
}
function vueTableau(){
  var aPreparer = DEMANDES.filter(function(d){ return d.statut === 2; }).length;
  var h = tete('Tableau de bord', aujourdhui(), VOIR_SITE + '<a class="btn btn-noir" href="#tarifs">' + svg('envoi') + 'Envoyer un tarif</a>');
  h += '<div class="stats">' +
    '<a class="panel stat" href="#demandes"><span class="stat-l">Nouvelles demandes</span><span class="stat-v">' + nouvelles() + '</span><span class="badge b-info">à traiter</span></a>' +
    '<a class="panel stat" href="#demandes"><span class="stat-l">Commandes à préparer</span><span class="stat-v">' + aPreparer + '</span><span class="badge b-ok">payées</span></a>' +
    '<a class="panel stat" href="#statistiques"><span class="stat-l">Visites cette semaine</span><span class="stat-v">1&nbsp;240</span><span class="badge b-ok">+18 % · exemple</span></a></div>';
  h += '<div class="grille"><div class="col">' +
    panneau('Dernières demandes', '<ul class="liste">' + DEMANDES.slice(0, 4).map(function(d){ return ligneDemande(d); }).join('') + '</ul>', '<a href="#demandes">Tout voir</a>') +
    panneau('Dernières modifications', '<ul class="liste">' + MODIFS.map(function(m){ return '<li><a class="ligne" href="' + m[3] + '"><span class="pastille"></span><span class="qui"><b>' + m[0] + '</b><small>' + m[1] + ' · ' + m[2] + '</small></span></a></li>'; }).join('') + '</ul>') +
    '</div><div class="col">' +
    panneau('Le site en ce moment', '<div class="pad">' + blocEtat() + '<p class="petit muet" style="margin-top:8px">Calculé tout seul avec vos horaires, sur toutes les pages.</p></div>', '<a href="#infos">Horaires</a>') +
    panneau('Vos tarifs', '<div class="pad"><p class="petit">Douglas brut : tarif de ' + I.tarifsDate + '.</p><p class="petit muet">Quand vos prix changent, envoyez votre fichier : Loïc les met en ligne dans la semaine.</p><a class="btn btn-blanc" style="margin-top:14px; width:100%" href="#tarifs">Envoyer un tarif</a></div>') +
    panneau('Où arrivent les demandes', '<div class="pad"><p class="petit muet">Chaque «&nbsp;Ma liste&nbsp;» envoyée depuis le site arrive ici, et par mail sur ' + I.email + '.</p></div>') +
    '</div></div>';
  return h;
}

/* ---------- Demandes ---------- */
function etapes(d){
  var w = d.statut / 4 * 80;
  return '<div class="etapes-w"><span class="barre" style="width:' + w + '%"></span><ol class="etapes" aria-label="Où en est la demande">' + STATUTS.map(function(s, i){
    var c = (i < d.statut || d.statut === 4) ? 'passe' : (i === d.statut ? 'cur' : '');
    return '<li' + (c ? ' class="' + c + '"' : '') + (i === d.statut ? ' aria-current="step"' : '') + '><i></i>' + s + '</li>';
  }).join('') + '</ol></div>';
}
function detail(d){
  var ls = lignesDe(d), tot = totalDe(d);
  var act = d.statut < 4 ? '<button type="button" class="btn btn-noir" data-act="avancer" data-id="' + d.id + '">' + ACTIONS[d.statut].replace('{p}', prenom(d)) + '</button>' : '<span class="badge">Terminée</span>';
  return '<a class="retour" href="#demandes">← Toutes les demandes</a>' +
    '<div><h2 id="t-dem">' + d.nom + ' · demande n° ' + d.id + '</h2><p class="meta">' + d.type + ' · ' + d.ville + ' · reçue ' + d.quand + '</p></div>' +
    etapes(d) +
    '<div class="acts">' + act + '<button type="button" class="btn btn-blanc" data-act="appeler">' + svg('tel') + 'Appeler</button><button type="button" class="btn btn-blanc" data-act="imprimer">' + svg('imprimer') + 'Imprimer la liste</button></div>' +
    (d.note ? '<p class="note-client"><b>Son message</b>' + esc(d.note) + '</p>' : '') +
    '<div class="tab-wrap"><table class="tab"><thead><tr><th>Pièce</th><th class="n">Qté</th><th class="n cache-tel">Prix</th><th class="n">Total</th></tr></thead><tbody>' +
    ls.map(function(l){ return '<tr><td>Douglas brut ' + sec(l.sec) + '<small>' + (NOMS_SEC[l.sec] ? NOMS_SEC[l.sec] + ' · ' : '') + l.lg + ' m</small></td><td class="n">' + l.q + '</td><td class="n cache-tel">' + eur(l.p) + '</td><td class="n"><b>' + eur(l.t) + '</b></td></tr>'; }).join('') +
    '</tbody></table></div>' +
    '<div class="total"><span>Total TTC</span><b>' + eur(tot) + '</b></div>' +
    '<div class="faits"><span class="fait">Poids ≈ ' + ent(poidsDe(d)) + ' kg</span><span class="fait">Retrait : ' + d.retrait + '</span>' + (tot >= 300 ? '<span class="fait">Remorque prêtée possible</span>' : '') + '<span class="fait">' + d.tel + '</span></div>' +
    '<p class="aide">Le devis et le paiement se font comme aujourd’hui. Ici, vous voyez où en est chaque demande, et le client reçoit un mail quand sa commande est prête.</p>';
}
function vueDemandes(arg){
  var f = FILTRES.filter(function(x){ return x[0] === filtre; })[0] || FILTRES[0];
  var liste = DEMANDES.filter(f[2]);
  var choisie = arg ? trouver(+arg) : null;
  var large = window.innerWidth >= 768;
  var d = choisie || (large ? liste[0] : null);
  var puces = FILTRES.map(function(x){ return '<button type="button" class="puce" data-act="filtre" data-f="' + x[0] + '" aria-pressed="' + (x[0] === filtre) + '">' + x[1] + ' <span>' + DEMANDES.filter(x[2]).length + '</span></button>'; }).join('');
  var h = '<div' + (choisie ? ' class="cache-tel"' : '') + '>' + tete('Demandes «&nbsp;Ma liste&nbsp;»', 'Chaque liste envoyée depuis le site arrive ici, et par mail.', '<div class="filtres">' + puces + '</div>') + '</div>';
  h += '<div class="dem' + (choisie ? ' a-detail' : '') + '"><div class="panel dem-liste"><ul class="liste">' +
    (liste.length ? liste.map(function(x){ return ligneDemande(x, d && x.id === d.id); }).join('') : '<li class="pad muet petit">Aucune demande ici.</li>') +
    '</ul></div>' + (d ? '<section class="panel detail" aria-labelledby="t-dem">' + detail(d) + '</section>' : '') + '</div>';
  return h;
}

/* ---------- Catalogue (sans stock) ---------- */
var CACHES = {'affaires-1':true};
function vignette(p){ return p.img ? '<img src="' + p.img + '" alt="" loading="lazy">' : '<svg viewBox="0 0 24 24" aria-hidden="true">' + D.ICONES[p.ic] + '</svg>'; }
function prixDe(p){ return p.prix ? '<span class="px">' + p.prix + ' <span class="muet">' + p.unite + '</span></span>' : '<span class="px sans">Sans prix affiché</span>'; }
function vueCatalogue(k){
  var cat = D.CATEGORIES.filter(function(c){ return c.k === k; })[0] || D.CATEGORIES[0];
  var nb = D.CATEGORIES.reduce(function(a, c){ return a + c.produits.length; }, 0);
  var h = tete('Catalogue', D.CATEGORIES.length + ' catégories, ' + nb + ' familles de produits', '<button type="button" class="btn btn-noir" data-act="ajouter-produit">' + svg('plus') + 'Ajouter un produit</button>');
  h += '<div class="filtres">' + D.CATEGORIES.map(function(c){ return '<a class="puce" href="#catalogue/' + c.k + '"' + (c === cat ? ' aria-current="true"' : '') + '>' + c.court + ' <span>' + c.produits.length + '</span></a>'; }).join('') + '</div>';
  h += '<div class="prods">' + cat.produits.map(function(p, i){
    var cle = cat.k + '-' + i, cache = !!CACHES[cle];
    return '<article class="panel prod' + (cache ? ' cache' : '') + '"><div class="ph">' + vignette(p) + (p.badge ? '<span class="badge b-noir">' + p.badge + '</span>' : '') + '</div>' +
      '<div class="corps"><b>' + esc(p.t) + '</b><small>' + esc(p.d) + '</small>' + prixDe(p) + '</div>' +
      '<div class="pied"><button type="button" class="inter" role="switch" aria-checked="' + !cache + '" data-act="visible" data-cle="' + cle + '"><i></i>' + (cache ? 'Masqué' : 'Visible') + '</button><button type="button" class="btn btn-blanc" data-act="modifier" data-k="' + cat.k + '" data-i="' + i + '">Modifier</button></div></article>';
  }).join('') + '</div>';
  h += '<p class="petit muet">Les prix viennent de vos tableaux de tarifs. Pour les changer, envoyez votre fichier dans <a href="#tarifs">Tarifs</a>.</p>';
  return h;
}

/* ---------- Tarifs : vous envoyez le fichier, Loïc met en ligne (l'import automatique est en option) ---------- */
var CHANGEMENTS = [['63x175', '4,00', 33.18, 34.18], ['63x175', '5,00', 41.47, 42.71], ['50x75', '3,00', 9.74, 10.03], ['50x75', '4,00', 12.98, 13.37], ['100x100', '3,00', 27.26, 28.08], ['75x225', '6,00', 82.76, 85.24]];
function tableauxDePrix(){
  var t = [];
  D.CATEGORIES.forEach(function(c){ c.produits.forEach(function(p){ if (p.prix && !(p.go && p.go.indexOf('?') > -1)) t.push(p); }); });
  return t;
}
function tarifComplet(){
  return '<section class="panel" id="tableau-douglas"><div class="tarif-titre"><b>Douglas brut de sciage</b><span>Prix TTC la pièce · tarif de ' + I.tarifsDate + '</span></div><div class="tab-wrap"><table class="tarif"><thead><tr><th>Section</th>' +
    D.LONGUEURS.map(function(l){ return '<th>' + l + ' m</th>'; }).join('') + '<th>le mètre</th></tr></thead><tbody>' +
    D.TARIF.map(function(t){ return '<tr><td><b>' + sec(t[0]) + '</b></td>' + D.LONGUEURS.map(function(l){ return t[1][l] ? '<td>' + fmt(t[1][l]) + '</td>' : '<td class="vide">–</td>'; }).join('') + '<td>' + fmt(t[2]) + '</td></tr>'; }).join('') +
    '</tbody></table></div><p class="pad petit muet">Ces prix viennent de votre fichier. Ils sont lus par vos clients, par Google et par les assistants comme ChatGPT.</p></section>';
}
function vueTarifs(voir){
  var h = tete('Tarifs', 'Vos prix en vrais tableaux sur le site. Dernier envoi : Douglas brut, ' + I.tarifsDate + '.', '');
  h += '<div class="grille"><div class="col">' +
    panneau('Envoyer un nouveau tarif', '<div class="pad"><div class="depot" id="depot"><span class="xls">XLS</span><div class="qui"><b id="dep-t">Votre fichier de tarifs, comme aujourd’hui</b><small id="dep-s">Excel ou PDF. Dernier fichier reçu : tarif-douglas-brut.xlsx, ' + I.tarifsDate + '.</small><div class="prog" id="dep-p"><i></i></div></div><button type="button" class="btn btn-noir" data-act="envoyer-tarif">' + svg('envoi') + 'Choisir le fichier</button></div>' +
      '<p class="envoye" id="dep-ok">C’est envoyé. Loïc met vos nouveaux prix en ligne dans la semaine et vous prévient par mail. C’est compris dans la maintenance.</p></div>') +
    panneau('Vos tableaux de prix en ligne', '<div class="tab-wrap"><table class="tab"><thead><tr><th>Tableau</th><th class="n">Prix</th><th></th></tr></thead><tbody>' +
      '<tr><td><b>Douglas brut de sciage</b><small>' + D.TARIF.length + ' sections, de 2 à 6 m</small></td><td class="n">dès ' + eur(2.82) + '</td><td class="n"><a class="btn btn-blanc" href="#tarifs/douglas-brut">Voir</a></td></tr>' +
      tableauxDePrix().filter(function(p){ return p.t !== 'Douglas brut de sciage'; }).map(function(p){ return '<tr><td><b>' + p.t + '</b><small>' + p.unite + '</small></td><td class="n">' + p.prix + '</td><td></td></tr>'; }).join('') +
      '</tbody></table></div>') +
    (voir === 'douglas-brut' ? tarifComplet() : '') +
    '</div><div class="col">' +
    panneau('Comment ça se passe', '<div class="pad"><ol class="etapes-txt"><li>Vous mettez votre fichier à jour, comme aujourd’hui.</li><li>Vous l’envoyez ici, en un clic.</li><li>Loïc met les nouveaux prix en ligne dans la semaine, et vous prévient.</li></ol></div>') +
    panneau('Module en plus : l’import automatique', '<div class="pad"><p class="petit muet">Vous déposez le fichier, vous voyez les prix qui changent, et vous publiez vous-même, tout de suite.</p><a class="btn btn-blanc" style="margin-top:14px; width:100%" href="#modules/import">Voir le module · 600 €</a></div>', '', 'option-cadre') +
    '</div></div>';
  return h;
}

/* ---------- Pages du site ---------- */
var PAGES = [
  {s:'accueil', t:'Accueil', f:'index.html', a:'/', img:'img/stock-planches.jpg', modif:'le 9 novembre', titre:'Prix directs de Scierie !', acc:'Spécialiste du Douglas depuis 1928, la scierie vous propose du bois sec et naturellement imputrescible, stocké à l’abri pour un usage immédiat.'},
  {s:'produits', t:'Nos produits', f:'produits.html', a:'/produits', img:'img/depot-hangar-droite.png', modif:'le 9 novembre', titre:'Nos produits', acc:'Tout ce qu’il vous faut, et juste ce qu’il vous faut ! Prix directs de Scierie, pour les professionnels comme pour les particuliers.'},
  {s:'la-scierie', t:'La scierie', f:'la-scierie.html', a:'/la-scierie', img:'img/grume-historique.jpg', modif:'hier', titre:'Une scierie de famille, aux portes d’Angers', acc:'Alfred Rétif crée la scierie en 1928, aux Cinq Routes. Depuis 2024, c’est Eva Rétif, la quatrième génération, qui la dirige.'},
  {s:'terrasse', t:'Je fais une terrasse', f:'terrasse.html', a:'/terrasse', img:'img/terrasse-chantier.jpg', modif:'lundi', titre:'Je fais une terrasse', acc:'Plots, lambourdes, lames, vis et huile : vous trouvez tout à la scierie, avec un Douglas sec et non traité.'},
  {s:'realisations', t:'Réalisations et actualités', f:'realisations.html', a:'/realisations', img:'img/terrasse-jardin.jpg', modif:'mardi', titre:'Réalisations et actualités', acc:'Les terrasses et le kiosque de nos clients, et les nouvelles de la scierie.'},
  {s:'contact', t:'Contact et commande', f:'contact.html', a:'/contact', img:'img/depot-facade.png', modif:'le 2 novembre', titre:'Contact et commande', acc:'Venez chercher votre bois aux Cinq Routes, ou demandez votre devis par mail. Pour une question, un coup de fil suffit.'},
  {s:'conseils', t:'Conseils et guides', f:'conseils.html', a:'/conseils', img:'img/conseils-sans-traitement.jpg', modif:'le 2 novembre', option:true, titre:'Conseils et guides', acc:'Nos guides de pro, en clair : choisir vos sections, préparer votre terrasse, choisir votre bois et le faire durer.'}
];
var PHOTOS_CHOIX = ['img/stock-planches.jpg', 'img/terrasse-maison.jpg', 'img/kiosque.jpg', 'img/depot-facade.png', 'img/grumes-cour.jpg'];
function vuePages(s){
  var p = PAGES.filter(function(x){ return x.s === s; })[0];
  if (!p){
    return tete('Pages du site', 'Les textes et les photos de chaque page, avec un aperçu avant de publier.', VOIR_SITE) +
      panneau('Les pages', '<ul class="liste">' + PAGES.map(function(x){
        return '<li><a class="ligne" href="#pages/' + x.s + '"><span class="vign"><img src="' + x.img + '" alt=""></span><span class="qui"><b>' + x.t + (x.option ? ' <span class="badge b-opt">module en plus</span>' : '') + '</b><small>scierie-retif.com' + x.a + ' · modifiée ' + x.modif + '</small></span><span class="btn btn-blanc">Modifier</span></a></li>';
      }).join('') + '</ul>');
  }
  return '<a class="retour" href="#pages">← Toutes les pages</a>' +
    tete(p.t, 'Page du site · scierie-retif.com' + p.a, '<a class="btn btn-blanc" href="' + p.f + '" target="_blank" rel="noopener">Voir la page ' + svg('externe') + '</a><button type="button" class="btn btn-noir" data-act="publier">Publier</button>') +
    '<div class="grille"><div class="col">' +
    panneau('En haut de la page', '<div class="pad champs"><label class="champ"><span>Titre</span><input id="ed-titre" value="' + esc(p.titre) + '"></label><label class="champ"><span>Accroche</span><textarea id="ed-acc">' + esc(p.acc) + '</textarea></label>' +
      '<div class="champ"><span>Photo</span><div class="photo-champ"><img id="ed-img" src="' + p.img + '" alt=""><button type="button" class="btn btn-blanc" data-act="photo">Changer la photo</button></div></div></div>') +
    '<p class="petit muet">Chaque publication garde la version d’avant. <button type="button" class="btn-lien" data-act="version" data-s="' + p.s + '">Revenir à la version d’avant</button></p>' +
    '</div><div class="col">' +
    panneau('Aperçu', '<div class="ph"><img id="ap-img" src="' + p.img + '" alt=""></div><div class="txt"><h3 id="ap-t">' + esc(p.titre) + '</h3><p id="ap-a">' + esc(p.acc) + '</p></div>', '<span class="badge" id="ap-etat">publiée</span>', 'apercu') +
    '</div></div>';
}

/* ---------- Photothèque ---------- */
var PHOTOS = [
  {m:'Novembre 2026', note:'ajoutées depuis le téléphone du dépôt', l:[['rea-coins-arrondis.jpg', 'Terrasse aux coins arrondis'], ['rea-decrochement.jpg', 'Terrasse avec décrochement'], ['rea-piece-angle.jpg', 'Pièce d’angle tournée']]},
  {m:'Octobre 2026', l:[['equipe-2026.jpg', 'L’équipe 2026'], ['terrasse-fraisoir.jpg', 'Le fraisoir'], ['kiosque.jpg', 'Kiosque sur terrasse'], ['terrasse-jardin.jpg', 'Grande terrasse Douglas'], ['terrasse-maison.jpg', 'Maison et terrasse']]},
  {m:'Plus anciennes', l:[['stock-planches.jpg', 'Piles sous le hangar'], ['depot-facade.png', 'Le dépôt'], ['depot-hangar-droite.png', 'Le hangar'], ['grume-historique.jpg', 'Grumes, photo d’époque'], ['scie.jpg', 'La scie'], ['grumes-cour.jpg', 'Grumes dans la cour'], ['terrasse-chantier.jpg', 'Lambourdes sur plots'], ['terrasse-garage.jpg', 'Terrasse devant la maison'], ['bois-chauffage.jpg', 'Bois de chauffage'], ['ossature.jpg', 'Solives d’un plancher']]}
];
function vuePhotos(){
  return tete('Photothèque', 'Toutes les photos du site, rangées par mois.', '<button type="button" class="btn btn-noir" data-act="ajouter-photos">' + svg('plus') + 'Ajouter des photos</button>') +
    PHOTOS.map(function(g){ return '<section class="mois"><h2>' + g.m + (g.note ? ' <small>' + g.note + '</small>' : '') + '</h2><div class="photos">' + g.l.map(function(x){ return '<figure><img src="img/' + x[0] + '" alt="" loading="lazy"><figcaption>' + x[1] + '</figcaption></figure>'; }).join('') + '</div></section>'; }).join('') +
    '<p class="petit muet">Exemple de rangement, avec les photos de votre site actuel.</p>';
}

/* ---------- Infos de la scierie ---------- */
var HORAIRES = [['Lundi', '8 h – 13 h', '14 h – 18 h'], ['Mardi', '8 h – 13 h', '14 h – 18 h'], ['Mercredi', '8 h – 13 h', '14 h – 18 h'], ['Jeudi', '8 h – 13 h', '14 h – 18 h'], ['Vendredi', '8 h – 13 h', '14 h – 18 h'], ['Samedi', '8 h – 12 h', 'Fermé'], ['Dimanche', 'Fermé', 'Fermé']];
function champ(lab, html){ return '<label class="champ"><span>' + lab + '</span>' + html + '</label>'; }
function vueInfos(){
  return tete('Infos de la scierie', 'Changées ici, elles changent partout : en-tête, pied de page, page contact, et ce que lit Google.', '<button type="button" class="btn btn-noir" data-act="enregistrer-infos">Enregistrer</button>') +
    '<div class="grille"><div class="col">' +
    panneau('Coordonnées', '<div class="pad champs"><div class="deux-champs">' + champ('Téléphone', '<input value="' + I.tel + '">') + champ('E-mail', '<input value="' + I.email + '">') + '</div>' + champ('Adresse', '<input value="' + esc(I.adresse) + '">') + champ('Comment venir', '<textarea>' + esc(I.acces) + '</textarea>') + '</div>') +
    panneau('Horaires', '<div class="tab-wrap"><table class="tab horaires"><thead><tr><th>Jour</th><th>Matin</th><th>Après-midi</th></tr></thead><tbody>' + HORAIRES.map(function(r){ return '<tr><td><b>' + r[0] + '</b></td><td><input value="' + r[1] + '" aria-label="' + r[0] + ', matin"></td><td><input value="' + r[2] + '" aria-label="' + r[0] + ', après-midi"></td></tr>'; }).join('') + '</tbody></table></div><div class="pad champs" style="padding-top:4px">' + champ('Enlèvements', '<input value="' + esc(I.retraits) + '">') + '</div>') +
    '</div><div class="col">' +
    panneau('Ce que voient vos clients', '<div class="pad">' + blocEtat() + '<p class="petit muet" style="margin-top:8px">Calculé tout seul avec vos horaires, en haut de chaque page et sur la page contact.</p></div>') +
    panneau('Module en plus : annonces et fermetures', '<div class="pad"><p class="petit muet">Une fermeture exceptionnelle, les sapins de Noël, une bonne affaire : un bandeau en haut du site, aux dates choisies.</p><a class="btn btn-blanc" style="margin-top:14px; width:100%" href="#modules/annonces">Voir le module · 150 €</a></div>', '', 'option-cadre') +
    '</div></div>';
}

/* ---------- Statistiques (exemples) ---------- */
function vueStats(){
  var jours = [['lun', 162], ['mar', 175], ['mer', 190], ['jeu', 168], ['ven', 201], ['sam', 236], ['dim', 108]];
  var top = [['Bastaing 63×175', 41], ['Lames de terrasse', 34], ['Chevron 50×75', 25], ['Poteau 100×100', 18], ['Planche 27×200', 12]];
  var vues = [['Douglas brut de sciage', 412], ['Accueil', 388], ['Je fais une terrasse', 164], ['Contact et commande', 121], ['Nos produits', 97]];
  var src = [['Google', '64 %'], ['Adresse tapée ou favori', '22 %'], ['Facebook et Instagram', '9 %'], ['Autres sites', '5 %']];
  return tete('Statistiques', 'Mesurées toutes seules sur le site · données d’exemple', '<span class="badge b-opt">7 derniers jours</span>') +
    '<div class="stats"><div class="panel stat"><span class="stat-l">Visites</span><span class="stat-v">1&nbsp;240</span><span class="badge b-ok">+18 % sur la semaine d’avant</span></div><div class="panel stat"><span class="stat-l">Listes envoyées</span><span class="stat-v">23</span><span class="badge b-ok">+5</span></div><div class="panel stat"><span class="stat-l">Visites depuis un téléphone</span><span class="stat-v">61 %</span></div><div class="panel stat"><span class="stat-l">Liste moyenne</span><span class="stat-v">412 €</span></div></div>' +
    '<div class="grille"><div class="col">' +
    panneau('Visites par jour', '<div class="jours">' + jours.map(function(j){ return '<div><i style="--h:' + Math.round(j[1] / 236 * 100) + '"></i>' + j[0] + '</div>'; }).join('') + '</div>') +
    panneau('Les plus ajoutés aux listes', '<div class="barres">' + top.map(function(b){ return '<div class="b"><span>' + b[0] + '</span><i style="--w:' + Math.round(b[1] / 41 * 100) + '"></i><span>' + b[1] + '</span></div>'; }).join('') + '</div>') +
    '</div><div class="col">' +
    panneau('Pages les plus vues', '<ul class="liste">' + vues.map(function(v){ return '<li><div class="ligne"><span class="qui"><b>' + v[0] + '</b></span><span class="mt">' + v[1] + '</span></div></li>'; }).join('') + '</ul>') +
    panneau('D’où viennent les visites', '<ul class="liste">' + src.map(function(v){ return '<li><div class="ligne"><span class="qui"><b>' + v[0] + '</b></span><span class="mt">' + v[1] + '</span></div></li>'; }).join('') + '</ul>') +
    '</div></div>';
}

/* ---------- Comptes ---------- */
function vueComptes(){
  var comptes = [['B', 'Bureau', 'l’ordinateur du bureau', 'Administrateur', 'aujourd’hui'], ['D', 'Dépôt', 'le téléphone du dépôt', 'Préparation', 'hier'], ['L', 'Loïc Stervinou', 'maintenance du site', 'Maintenance', 'mardi']];
  return tete('Comptes', 'Chaque personne a son propre accès, avec ses droits.', '<button type="button" class="btn btn-noir" data-act="inviter">' + svg('plus') + 'Inviter une personne</button>') +
    panneau('Les comptes', '<ul class="liste">' + comptes.map(function(c){ return '<li><div class="ligne"><span class="ep-av">' + c[0] + '</span><span class="qui"><b>' + c[1] + '</b><small>' + c[2] + ' · dernière connexion ' + c[4] + '</small></span><span class="badge' + (c[3] === 'Administrateur' ? ' b-noir' : '') + '">' + c[3] + '</span></div></li>'; }).join('') + '</ul>') +
    panneau('Les niveaux', '<div class="niveaux"><div><h3>Administrateur</h3><ul><li>Demandes</li><li>Catalogue et tarifs</li><li>Pages et photos</li><li>Infos et horaires</li><li>Statistiques et comptes</li></ul></div><div><h3>Préparation</h3><ul><li>Demandes</li><li>Photothèque, pour ajouter des photos</li><li class="non">Catalogue et tarifs</li><li class="non">Pages, infos et horaires</li><li class="non">Statistiques et comptes</li></ul></div></div>');
}

/* ---------- Options ---------- */
function apercuOption(o){
  if (o.r === 'import') return panneau('Essayez', '<div class="pad"><div class="depot" id="imp"><span class="xls">XLS</span><div class="qui"><b id="imp-t">Déposez votre fichier de tarifs ici</b><small id="imp-s">Dernier fichier : tarif-douglas-brut.xlsx, ' + I.tarifsDate + '</small><div class="prog" id="imp-p"><i></i></div></div><button type="button" class="btn btn-noir" data-act="simuler-import">Simuler un dépôt</button></div>' +
    '<div class="diff" id="imp-diff"><div class="sum"><span class="badge b-att">6 prix modifiés</span><span class="badge b-ok">0 erreur</span><span class="badge">prix d’exemple</span></div><div class="tab-wrap"><table class="tab"><thead><tr><th>Pièce</th><th>Longueur</th><th class="n">Avant</th><th class="n">Après</th><th class="n">Écart</th></tr></thead><tbody>' +
    CHANGEMENTS.map(function(c){ return '<tr><td>Douglas brut ' + sec(c[0]) + '</td><td>' + c[1] + ' m</td><td class="n old">' + eur(c[2]) + '</td><td class="n new">' + eur(c[3]) + '</td><td class="n pct">+' + ((c[3] / c[2] - 1) * 100).toFixed(1).replace('.', ',') + ' %</td></tr>'; }).join('') +
    '</tbody></table></div><div class="acts" style="margin-top:14px"><button type="button" class="btn btn-noir" data-act="publier-import">Publier sur le site</button><button type="button" class="btn btn-blanc" data-act="annuler-import">Annuler</button></div></div>' +
    '<p class="ok-msg" id="imp-ok">C’est en ligne : le site et «&nbsp;Ma liste&nbsp;» affichent les nouveaux prix.</p></div>');
  if (o.r === 'calculateur') return panneau('Sur la maquette du site', '<div class="pad"><p class="petit muet">La maquette montre déjà le calculateur, sur la page terrasse et dans les conseils.</p><div class="acts" style="margin-top:14px"><a class="btn btn-blanc" href="terrasse.html#calculateur" target="_blank" rel="noopener">La page terrasse ' + svg('externe') + '</a><a class="btn btn-blanc" href="conseils.html#solivage" target="_blank" rel="noopener">Le solivage ' + svg('externe') + '</a></div></div>');
  if (o.r === 'conseils') return panneau('Sur la maquette du site', '<div class="pad"><p class="petit muet">La maquette montre déjà la rubrique, avec vos guides.</p><a class="btn btn-blanc" style="margin-top:14px" href="conseils.html" target="_blank" rel="noopener">Voir les conseils ' + svg('externe') + '</a></div>');
  if (o.r === 'avis') return panneau('Le mail que reçoit le client', '<div class="pad"><div class="mail-ex"><div class="ent"><b>Scierie Rétif</b> · Merci pour votre commande</div><div class="corps"><p>Bonjour,</p><p>Merci pour votre passage à la scierie. Si le bois et l’accueil vous ont plu, votre avis aide d’autres clients à nous trouver.</p><p class="etoiles" aria-hidden="true">★★★★★</p><p><span class="btn btn-noir">Laisser un avis sur Google</span></p></div></div></div>');
  if (o.r !== 'annonces') return '';
  return panneau('Ce que voient vos clients', '<div class="pad champs"><div class="bandeau-ex"><span>Fermé du jeudi 24 décembre au dimanche 3 janvier</span><span>Réouverture le lundi 4 janvier à 8 h</span></div><div class="deux-champs">' + champ('Du', '<input value="jeudi 24 décembre">') + champ('Au', '<input value="dimanche 3 janvier">') + '</div><p class="petit muet">Exemple de dates.</p></div>');
}
var DEMANDES_MODULES = {};
function boutonAjout(o, large){
  return DEMANDES_MODULES[o.r] ? '<span class="btn btn-blanc' + (large ? '' : ' btn-plein') + '" aria-disabled="true">' + (large ? 'Demande envoyée' : 'Demandé') + '</span>' : '<button type="button" class="btn btn-noir' + (large ? '' : ' btn-plein') + '" data-act="ajouter-module" data-k="' + o.r + '">' + svg('plus') + 'Ajouter</button>';
}
function vueOption(o){
  return '<a class="retour" href="#modules">← Tous les modules</a>' + tete(o.titre, (o.reco ? '<span class="badge b-noir">Recommandé</span> ' : '') + '<span class="badge b-opt">Module en plus · ' + o.prix + ' € ' + (o.unite || 'HT') + '</span>', boutonAjout(o, true)) +
    '<div class="grille"><div class="col">' +
    panneau('Ce que ça fait', '<div class="pad opt-intro"><p>' + (o.intro || o.court) + '</p>' + (o.pts ? '<ul>' + o.pts.map(function(p){ return '<li>' + p + '</li>'; }).join('') + '</ul>' : '') + '</div>') +
    apercuOption(o) +
    '</div><div class="col">' +
    panneau('Bon à savoir', '<div class="pad"><p class="petit muet">Ce module n’est pas dans le devis de départ. Il s’ajoute au site quand vous voulez, sans rien refaire.</p><p class="stat-v" style="margin-top:12px">' + o.prix + ' € <span class="petit muet">' + (o.unite || 'HT, une fois') + '</span></p></div>', '', 'option-cadre') +
    '</div></div>';
}

/* ---------- Modules : ceux du devis, et ceux qu'on peut ajouter ---------- */
function carteModule(x){
  return '<article class="panel module"><div class="module-h"><span class="ic">' + svg(x.ic) + '</span>' + (x.reco ? '<span class="badge b-noir">Recommandé</span>' : '') + '</div>' +
    '<h3>' + x.titre + '</h3><p>' + x.court + '</p><p class="prix">' + x.prix + ' € <small>' + (x.unite || 'HT, une fois') + '</small></p>' +
    '<div class="acts"><a class="btn btn-blanc btn-plein" href="#modules/' + x.r + '">Découvrir</a>' + boutonAjout(x) + '</div></article>';
}
function vueModules(k){
  var o = OPTIONS.filter(function(x){ return x.r === k; })[0];
  if (o) return vueOption(o);
  var actifs = MENU.filter(function(m){ return m.r !== 'tableau-de-bord' && m.r !== 'modules'; });
  function dans(id, x){ return id === 'tous' || (id === 'reco' ? !!x.reco : x.g === id); }
  function nb(id){ return id === 'actifs' ? actifs.length : OPTIONS.filter(function(x){ return dans(id, x); }).length; }
  var h = tete('Modules', 'Ajoutez une fonction quand vous en avez besoin, sans rien refaire.', '');
  h += '<div class="filtres" role="group" aria-label="Trier les modules">' + ONGLETS.map(function(t){ return '<button type="button" class="puce" data-act="onglet-mod" data-o="' + t[0] + '" aria-pressed="' + (t[0] === onglet) + '">' + t[1] + ' <span>' + nb(t[0]) + '</span></button>'; }).join('') + '</div>';
  if (onglet === 'reco') h += '<p class="petit muet">Choisis pour une scierie qui vend sur tarif : ils vont avec votre catalogue et «&nbsp;Ma liste&nbsp;».</p>';
  if (onglet === 'actifs') return h + '<div class="actifs">' + actifs.map(function(m){
    return '<a class="panel actif" href="#' + m.r + '"><span class="ic">' + svg(m.ic) + '</span><b>' + (m.titre || m.t) + '</b><span class="badge b-ok">Actif</span></a>';
  }).join('') + '</div>';
  return h + '<div class="modules">' + OPTIONS.filter(function(x){ return dans(onglet, x); }).map(carteModule).join('') + '</div>';
}

/* ---------- Coque, menu et adresses ---------- */
var VUES = {'tableau-de-bord':vueTableau, demandes:vueDemandes, catalogue:vueCatalogue, tarifs:vueTarifs, pages:vuePages, photos:vuePhotos, infos:vueInfos, statistiques:vueStats, comptes:vueComptes, modules:vueModules};
var root, main, toastEl, fen, retourFocus;

function lien(m){ return '<a href="#' + m.r + '" data-r="' + m.r + '"' + (m.sep ? ' class="sep"' : '') + '>' + svg(m.ic) + '<span>' + m.t + '</span>' + (m.compte ? '<span class="ep-count" id="ep-count">' + nouvelles() + '</span>' : '') + '</a>'; }
function coque(){
  root.innerHTML = '<aside class="ep-side"><div class="ep-top"><a class="ep-brand" href="#tableau-de-bord"><img src="img/logo-rond.png" alt=""><span><b>Scierie Rétif</b><small>Espace pro</small></span></a>' +
    '<button type="button" class="ep-menu-btn" data-act="menu" aria-expanded="false" aria-controls="ep-nav">' + svg('menu') + '<span>Menu</span></button></div>' +
    '<div class="ep-navwrap" id="ep-nav"><nav class="ep-nav" aria-label="Menu de l’espace pro">' + MENU.map(lien).join('') + '</nav>' +
    '<div class="ep-account"><span class="ep-maq">Maquette</span><div class="ep-who"><span class="ep-av">B</span><span><b>Bureau</b>Administrateur</span></div><a href="index.html" target="_blank" rel="noopener">Voir le site ↗</a><button type="button" data-act="deconnexion">Se déconnecter</button></div></div></aside>' +
    '<div class="ep-voile" data-act="menu-fermer"></div><main class="ep-main" id="ep-main" tabindex="-1"></main>' +
    '<div class="fenetre" id="fen" role="dialog" aria-modal="true" aria-labelledby="fen-t"><div class="boite"></div></div>' +
    '<div class="toast" role="status" aria-live="polite"></div>';
  main = $('#ep-main', root); toastEl = $('.toast', root); fen = $('#fen', root);
}
function adresse(){ var h = decodeURIComponent(location.hash.replace(/^#\/?/, '')) || 'tableau-de-bord'; var p = h.split('/'); return {nom:VUES[p[0]] ? p[0] : 'tableau-de-bord', arg:p[1]}; }
function rendre(garder){
  var a = adresse();
  main.innerHTML = VUES[a.nom](a.arg);
  $$('.ep-nav a', root).forEach(function(x){ if (x.getAttribute('data-r') === a.nom) x.setAttribute('aria-current', 'page'); else x.removeAttribute('aria-current'); });
  var o = a.nom === 'modules' ? OPTIONS.filter(function(x){ return x.r === a.arg; })[0] : null;
  var m = o ? {t:o.titre} : MENU.filter(function(x){ return x.r === a.nom; })[0];
  document.title = (m ? (m.titre || m.t).replace(/&nbsp;/g, ' ') : 'Espace pro') + ' · Espace pro · Scierie Rétif (maquette)';
  $('#ep-count', root).textContent = nouvelles();
  fermerMenu();
  if (!garder) window.scrollTo(0, 0);
}
function toast(t){ toastEl.innerHTML = t; toastEl.classList.add('on'); clearTimeout(toastEl._t); toastEl._t = setTimeout(function(){ toastEl.classList.remove('on'); }, 2800); }
function fermerMenu(){ root.classList.remove('menu-ouvert'); var b = $('.ep-menu-btn', root); b.setAttribute('aria-expanded', 'false'); $('span', b).textContent = 'Menu'; $('svg', b).innerHTML = IC.menu; }
function ouvrirMenu(){ root.classList.add('menu-ouvert'); var b = $('.ep-menu-btn', root); b.setAttribute('aria-expanded', 'true'); $('span', b).textContent = 'Fermer'; $('svg', b).innerHTML = IC.fermer; }

/* Fenêtre « Modifier le produit » */
function ouvrirProduit(k, i, bouton){
  var cat = D.CATEGORIES.filter(function(c){ return c.k === k; })[0], p = cat.produits[i];
  retourFocus = bouton;
  $('.boite', fen).innerHTML = '<div class="panel-h"><h2 id="fen-t">Modifier le produit</h2><button type="button" class="btn btn-blanc" data-act="fermer">Fermer</button></div><div class="pad">' +
    champ('Nom', '<input id="pr-t" value="' + esc(p.t) + '">') + champ('Phrase d’explication', '<textarea id="pr-d">' + esc(p.d) + '</textarea>') +
    '<div class="champ"><span>Photo</span><div class="photo-champ">' + (p.img ? '<img src="' + p.img + '" alt="">' : '') + '<button type="button" class="btn btn-blanc" data-act="photo-produit">Choisir dans la photothèque</button></div></div>' +
    '<p class="petit muet">' + (p.prix ? 'Prix : ' + p.prix + ' ' + p.unite + '. Il vient de votre tarif et change quand vous envoyez un nouveau fichier.' : 'Pas de prix affiché pour ce produit.') + '</p>' +
    '<div class="acts"><button type="button" class="btn btn-noir" data-act="enregistrer-produit" data-k="' + k + '" data-i="' + i + '">Enregistrer</button><button type="button" class="btn btn-blanc" data-act="fermer">Annuler</button></div></div>';
  fen.classList.add('on');
  $('#pr-t', fen).focus();
}
function fermerFenetre(){ fen.classList.remove('on'); if (retourFocus && document.body.contains(retourFocus)) retourFocus.focus(); }

/* Simulations */
function simulerEnvoi(){
  var dep = $('#depot', main), p = $('#dep-p', main), barre = $('i', p);
  dep.classList.add('chaud'); $('#dep-t', main).textContent = 'tarif-douglas-brut-2027.xlsx'; $('#dep-s', main).textContent = 'Envoi en cours…';
  $('#dep-ok', main).classList.remove('on'); p.style.display = 'block'; barre.style.width = '0';
  requestAnimationFrame(function(){ requestAnimationFrame(function(){ barre.style.width = '100%'; }); });
  setTimeout(function(){ if (!document.body.contains(dep)) return; dep.classList.remove('chaud'); p.style.display = 'none'; $('#dep-s', main).textContent = 'Envoyé à l’instant'; $('#dep-ok', main).classList.add('on'); toast('Fichier envoyé à <b>Loïc</b>.'); }, REDUIT ? 10 : 1300);
}
function simulerImport(){
  var dep = $('#imp', main), p = $('#imp-p', main), barre = $('i', p);
  dep.classList.add('chaud'); $('#imp-t', main).textContent = 'tarif-douglas-brut-2027.xlsx'; $('#imp-s', main).textContent = 'Lecture du fichier…';
  $('#imp-ok', main).classList.remove('on'); $('#imp-diff', main).classList.remove('on'); p.style.display = 'block'; barre.style.width = '0';
  requestAnimationFrame(function(){ requestAnimationFrame(function(){ barre.style.width = '100%'; }); });
  setTimeout(function(){ if (!document.body.contains(dep)) return; dep.classList.remove('chaud'); p.style.display = 'none'; $('#imp-s', main).textContent = D.TARIF.length + ' sections lues, 6 prix changent'; $('#imp-diff', main).classList.add('on'); }, REDUIT ? 10 : 1300);
}

function surClic(e){
  var b = e.target.closest('[data-act]');
  if (!b) return;
  var act = b.getAttribute('data-act');
  if (act === 'menu'){ if (root.classList.contains('menu-ouvert')) fermerMenu(); else ouvrirMenu(); return; }
  if (act === 'menu-fermer'){ fermerMenu(); return; }
  if (act === 'avancer'){
    var d = trouver(+b.getAttribute('data-id')), avant = d.statut;
    d.statut = Math.min(4, d.statut + 1);
    rendre(true);
    var barre = $('.barre', main);
    if (barre && !REDUIT){ var fin = barre.style.width; barre.style.transition = 'none'; barre.style.width = (avant / 4 * 80) + '%'; void barre.offsetWidth; barre.style.transition = ''; barre.style.width = fin; }
    toast(MESSAGES[avant].replace('{n}', d.id).replace('{p}', prenom(d)));
    return;
  }
  if (act === 'filtre'){ filtre = b.getAttribute('data-f'); if (location.hash.indexOf('#demandes/') === 0) location.hash = '#demandes'; else rendre(true); return; }
  if (act === 'appeler'){ toast('Appel désactivé dans la maquette.'); return; }
  if (act === 'imprimer'){ toast('La liste s’imprime sur une page, prête pour le dépôt.'); return; }
  if (act === 'visible'){ var c = b.getAttribute('data-cle'); CACHES[c] = !CACHES[c]; rendre(true); toast(CACHES[c] ? 'Produit masqué : il n’apparaît plus sur le site.' : 'Produit visible sur le site.'); return; }
  if (act === 'modifier'){ ouvrirProduit(b.getAttribute('data-k'), +b.getAttribute('data-i'), b); return; }
  if (act === 'fermer'){ fermerFenetre(); return; }
  if (act === 'photo-produit'){ toast('La photothèque s’ouvre pour choisir une photo.'); return; }
  if (act === 'enregistrer-produit'){
    var cat = D.CATEGORIES.filter(function(x){ return x.k === b.getAttribute('data-k'); })[0], p = cat.produits[+b.getAttribute('data-i')];
    p.t = $('#pr-t', fen).value || p.t; p.d = $('#pr-d', fen).value || p.d;
    fermerFenetre(); rendre(true); toast('Enregistré : c’est en ligne sur le site.'); return;
  }
  if (act === 'ajouter-produit'){ toast('Exemple : une fiche vide s’ouvre, avec sa photo et sa catégorie.'); return; }
  if (act === 'envoyer-tarif'){ simulerEnvoi(); return; }
  if (act === 'simuler-import'){ simulerImport(); return; }
  if (act === 'publier-import'){ $('#imp-diff', main).classList.remove('on'); $('#imp-ok', main).classList.add('on'); $('#imp-s', main).textContent = 'En ligne depuis à l’instant'; toast('Nouveaux prix en ligne.'); return; }
  if (act === 'annuler-import'){ $('#imp-diff', main).classList.remove('on'); $('#imp-t', main).textContent = 'Déposez votre fichier de tarifs ici'; $('#imp-s', main).textContent = 'Dernier fichier : tarif-douglas-brut.xlsx, ' + I.tarifsDate; return; }
  if (act === 'publier'){ var et = $('#ap-etat', main); if (et){ et.textContent = 'publiée'; et.className = 'badge b-ok'; } toast('Publié : la page est à jour sur le site.'); return; }
  if (act === 'photo'){ var img = $('#ed-img', main), ap = $('#ap-img', main), n = (PHOTOS_CHOIX.indexOf(img.getAttribute('src')) + 1) % PHOTOS_CHOIX.length; img.src = ap.src = PHOTOS_CHOIX[n]; marquerModifie(); toast('Photo choisie dans la photothèque.'); return; }
  if (act === 'version'){ rendre(true); toast('La version d’avant est revenue dans l’éditeur. Publiez pour la remettre en ligne.'); return; }
  if (act === 'enregistrer-infos'){ toast('Enregistré : en-tête, pied de page et page contact sont à jour.'); return; }
  if (act === 'ajouter-photos'){ toast('Sur le téléphone, l’appareil photo s’ouvre directement.'); return; }
  if (act === 'inviter'){ toast('La personne reçoit un mail pour choisir son mot de passe.'); return; }
  if (act === 'deconnexion'){ toast('Désactivé dans la maquette.'); return; }
  if (act === 'onglet-mod'){ onglet = b.getAttribute('data-o'); rendre(true); return; }
  if (act === 'ajouter-module'){ var mo = OPTIONS.filter(function(x){ return x.r === b.getAttribute('data-k'); })[0]; DEMANDES_MODULES[mo.r] = true; rendre(true); toast('Demande envoyée à <b>Loïc</b> pour «&nbsp;' + mo.titre + '&nbsp;».'); return; }
}
function marquerModifie(){ var et = $('#ap-etat', main); if (et){ et.textContent = 'modifiée, pas encore publiée'; et.className = 'badge b-att'; } }
function surSaisie(e){
  var id = e.target.id;
  if (id === 'ed-titre') $('#ap-t', main).textContent = e.target.value;
  else if (id === 'ed-acc') $('#ap-a', main).textContent = e.target.value;
  else return;
  marquerModifie();
}

document.addEventListener('DOMContentLoaded', function(){
  root = document.getElementById('ep');
  coque();
  rendre(true);
  window.addEventListener('hashchange', function(){ rendre(false); });
  document.addEventListener('click', surClic);
  document.addEventListener('input', surSaisie);
  fen.addEventListener('click', function(e){ if (e.target === fen) fermerFenetre(); });
  document.addEventListener('keydown', function(e){
    if (e.key !== 'Escape') return;
    if (fen.classList.contains('on')) fermerFenetre();
    else if (root.classList.contains('menu-ouvert')){ fermerMenu(); $('.ep-menu-btn', root).focus(); }
  });
});
})();
