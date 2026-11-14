/* Données de la maquette (téléphone et ordinateur), relevées sur le site de la Scierie Rétif le 20/10/2026.
   Prix réels : Douglas brut C18 (juin 2026), Douglas raboté C24 (29/06/2026), lames de terrasse, liteaux, plancher, plinthes,
   palissades, vis, colles et espaceurs (pages de tarifs du site). Les autres produits n'ont pas de prix affiché ici. */
window.RetifDonnees = (function(){
  /* Les 6 sections mises en avant (fiche produit sur téléphone) */
  var SECTIONS = [
    {id:'50x75', w:50, h:75, nom:'Chevron', usage:'toiture, lambourdes de terrasse', prix:{'2,00':6.49,'2,50':8.11,'3,00':9.74,'4,00':12.98,'5,00':16.23}},
    {id:'63x175', w:63, h:175, nom:'Bastaing', usage:'solives, ossature', prix:{'3,00':24.88,'4,00':33.18,'5,00':41.47}},
    {id:'75x225', w:75, h:225, nom:'Madrier', usage:'grosses poutres', prix:{'5,00':66.44,'6,00':82.76}},
    {id:'100x100', w:100, h:100, nom:'Poteau', usage:'pergola, abri, clôture', prix:{'2,00':18.17,'2,50':22.72,'3,00':27.26,'4,00':36.34}},
    {id:'150x150', w:150, h:150, nom:'Gros poteau', usage:'carport, charpente', prix:{'2,00':39.12,'2,50':48.90,'3,00':58.67,'4,00':78.23}},
    {id:'27x200', w:27, h:200, nom:'Planche', usage:'coffrage, aménagement', prix:{'2,00':9.90,'2,50':12.38,'3,00':14.85,'4,00':19.80}}
  ];
  /* La grille complète du Douglas brut C18 : [section, prix par longueur, prix au mètre, prix au m²] */
  var TARIF = [
    ['18x150', {'2,00':5.58,'2,50':6.97,'3,00':8.37,'4,00':11.15}, 2.79, 18.59],
    ['18x200', {'2,00':7.44,'2,50':9.30,'3,00':11.15,'4,00':14.87}, 3.72, 18.59],
    ['27x50', {'2,00':2.82,'2,50':3.52,'3,00':4.22,'4,00':5.63}, 1.41, 28.20],
    ['27x100', {'2,00':5.57,'2,50':6.95,'3,00':8.35,'4,00':11.13}, 2.78, 27.83],
    ['27x200', {'2,00':9.90,'2,50':12.38,'3,00':14.85,'4,00':19.80}, 4.95, 24.75],
    ['27x250', {'4,00':25.52}, 6.38, 25.52],
    ['27x300', {'4,00':32.74}, 8.19, 27.28],
    ['35x50', {'2,50':4.68,'3,00':5.61,'4,00':7.48}, 1.87],
    ['35x100', {'2,50':8.25,'3,00':9.90,'4,00':13.20}, 3.30],
    ['35x150', {'2,00':8.16,'2,50':10.20,'3,00':12.24,'4,00':16.32}, 4.08],
    ['35x200', {'2,00':12.87,'2,50':16.08,'3,00':19.31,'4,00':25.74,'5,00':32.18}, 6.44],
    ['35x250', {'4,00':34.10}, 8.53],
    ['35x300', {'4,00':40.70}, 10.18],
    ['40x60', {'3,00':7.59,'4,00':10.12}, 2.53],
    ['50x50', {'2,00':4.84,'2,50':6.05,'3,00':7.26,'4,00':9.68}, 2.42],
    ['50x75', {'2,00':6.49,'2,50':8.11,'3,00':9.74,'4,00':12.98,'5,00':16.23}, 3.25],
    ['50x100', {'2,00':7.74,'2,50':9.68,'3,00':11.62,'4,00':15.49,'5,00':19.36}, 3.87],
    ['50x150', {'2,50':14.16,'3,00':17.00,'4,00':22.66,'5,00':28.33}, 5.67],
    ['50x200', {'2,50':19.44,'3,00':23.33,'4,00':31.11,'5,00':38.89,'6,00':49.50}, 7.78],
    ['63x175', {'3,00':24.88,'4,00':33.18,'5,00':41.47}, 8.30],
    ['75x75', {'2,00':9.86,'2,50':12.32,'3,00':14.78,'4,00':19.71}, 4.93],
    ['75x100', {'2,50':16.39,'3,00':19.67,'4,00':26.22}, 6.56],
    ['75x150', {'3,00':26.96,'4,00':35.95,'5,00':44.94}, 8.99],
    ['75x200', {'3,00':34.91,'4,00':46.55,'5,00':58.19,'6,00':72.34}, 11.64],
    ['75x225', {'5,00':66.44,'6,00':82.76}, 13.29],
    ['100x100', {'2,00':18.17,'2,50':22.72,'3,00':27.26,'4,00':36.34}, 9.09],
    ['100x200', {'2,50':43.80,'3,00':52.57,'4,00':70.09,'5,00':87.62}, 17.52],
    ['150x150', {'2,00':39.12,'2,50':48.90,'3,00':58.67,'4,00':78.23}, 19.56],
    ['200x200', {'2,00':69.50,'2,50':86.87,'3,00':104.25,'4,00':139.00,'5,00':173.75}, 34.75]
  ];
  var NOMS = {'50x75':'chevron', '63x175':'bastaing', '75x200':'madrier', '75x225':'madrier', '100x100':'poteau', '150x150':'poteau', '200x200':'poutre', '27x200':'planche', '27x100':'planche'};
  var LONGUEURS = ['2,00','2,50','3,00','4,00','5,00','6,00'];

  var ICONES = {
    arbre:'<path d="M12 3 6.5 10.5h3L5 17h14l-4.5-6.5h3z"/><path d="M12 17v4"/>',
    parquet:'<rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 9.7h18M3 14.3h18M9 5v4.7M15 9.7v4.6M7 14.3V19"/>',
    panneau:'<rect x="4" y="4" width="16" height="16" rx="1.5"/><path d="M8 8.5l2 .5M14 7.5l2 1.5M7.5 14l2.5-1M13.5 15.5l2.5.5M10.5 11.5l3 .5"/>',
    connecteur:'<path d="M5 4v15h15"/><path d="M9 4v11h11"/><circle cx="7" cy="16.8" r=".6"/><circle cx="16" cy="17" r=".6"/>',
    colle:'<path d="M9.5 3h5v3.5l2 3V20a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1V9.5l2-3z"/><path d="M9.5 6.5h5"/>',
    flamme:'<path d="M12 21c-3.6 0-6-2.4-6-5.8 0-2.8 1.8-4.6 2.9-6.6.9 1.6 1.9 2.2 2.9 2.2.2-2.6 1.3-4.8 3.2-6.8.1 4 3 6.1 3 10.9 0 3.6-2.4 6.1-6 6.1z"/>',
    copeaux:'<path d="M4 16c2.5-5.5 6-5.5 8 0M10.5 19c2-4.5 5.5-5.5 8.5-1.5M6 10.5c2-3 4.5-3 6.5 0M14 8c1.5-2.5 3.5-2.5 5 0"/>',
    etiquette:'<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.5"/>',
    remorque:'<rect x="2.5" y="7.5" width="13" height="7.5" rx="1"/><path d="M15.5 12.5h6"/><circle cx="8" cy="17.5" r="2"/>'
  };

  var CATEGORIES = [
    {k:'charpente', t:'Charpente et ossature', court:'Charpente', d:'Bois de structure sec, en Douglas et en chêne', img:'img/stock-planches.jpg', produits:[
      {t:'Douglas brut de sciage', d:'Bastaings, chevrons, madriers, poteaux : 29 sections au tarif', img:'img/stock-planches.jpg', prix:'dès 2,82 €', unite:'la pièce', go:'prod', stock:true},
      {t:'Douglas raboté C24', d:'Rabotage 1, 2 ou 4 faces, pour une belle charpente apparente', img:'img/produits/douglas-rabote.jpg', prix:'dès 5,19 €', unite:'la pièce', stock:true},
      {t:'Poteaux et poutres', d:'Grandes sections pour charpente, carport et pergola', img:'img/produits/poteaux-poutres.jpg'},
      {t:'Volige', d:'Sous-toiture et habillage', img:'img/produits/volige.jpg'},
      {t:'Chêne massif', d:'Poteaux et planches en chêne', ic:'arbre'}
    ]},
    {k:'terrasse', t:'Terrasse', court:'Terrasse', d:'Lames, lambourdes, plots et vis', img:'img/terrasse-chantier.jpg', produits:[
      {t:'Lames de terrasse Douglas', d:'Lisses ou striées, épaisses de 25 mm, larges de 145 ou 200 mm', img:'img/produits/lame-terrasse-douglas.jpg', prix:'dès 35,25 €', unite:'le m²', stock:true},
      {t:'Lames de terrasse robinier', d:'Un bois très dur, naturellement durable', img:'img/produits/lame-terrasse-robinier.jpg'},
      {t:'Lambourdes Douglas 50×75', d:'La structure qui porte les lames', img:'img/terrasse-chantier.jpg', prix:'dès 6,49 €', unite:'la pièce', go:'prod', sel:'50x75', stock:true},
      {t:'Plots réglables', d:'Pour un sol irrégulier, jusqu’à une tonne par plot', img:'img/produits/plot.jpg', contenu:true},
      {t:'Vis inox et espaceurs', d:'Au moins 25 vis par m² en lames de 200 mm', img:'img/produits/vis-terrasse.jpg', prix:'12,00 €', unite:'les 100 espaceurs'}
    ]},
    {k:'bardage', t:'Bardage et façade', court:'Bardage', d:'Clin, lambris, liteaux et volets', img:'img/terrasse-maison.jpg', produits:[
      {t:'Clin et bardage Douglas', d:'Pour habiller une façade', img:'img/produits/bardage.jpg'},
      {t:'Lambris Douglas', d:'Murs et plafonds intérieurs', img:'img/produits/lambris.jpg'},
      {t:'Liteaux sapin traité 18×50', d:'Classe II, en bottes de 9 liteaux de 4 m', img:'img/produits/liteaux.jpg', prix:'28,08 €', unite:'la botte', contenu:true},
      {t:'Lames à volets', d:'Tout pour faire ses volets en Douglas', img:'img/produits/lames-volets.jpg'}
    ]},
    {k:'jardin', t:'Clôture et jardin', court:'Jardin', d:'Palissades, claustras, abris et pergolas', img:'img/produits/palissade.jpg', produits:[
      {t:'Palissades et claustras', d:'Panneau de 2 × 2 m, poteaux et visserie inox compris', img:'img/produits/palissade.jpg', prix:'dès 119,10 €', unite:'le panneau'},
      {t:'Abris, pergolas et cabanes', d:'Pour le jardin et la terrasse', img:'img/kiosque.jpg'}
    ]},
    {k:'interieur', t:'Intérieur et menuiserie', court:'Intérieur', d:'Planchers, parquets, planches et panneaux', img:'img/produits/plancher-douglas.jpg', produits:[
      {t:'Plancher Douglas à visser', d:'23 × 180 mm, à visser sur lambourdes ou solives', img:'img/produits/plancher-douglas.jpg', prix:'dès 36,31 €', unite:'le m²', stock:true},
      {t:'Parquets feuillus', d:'Chêne, frêne…', ic:'parquet'},
      {t:'Plinthes Douglas 14×90', d:'Longueur 2,5 m, nature, teintées ou peintes', img:'img/produits/plinthe.jpg', prix:'7,92 €', unite:'la plinthe', contenu:true, stock:true},
      {t:'Planches de menuiserie', d:'Brutes, pour meubles et agencements', img:'img/produits/planches.jpg'},
      {t:'Panneaux Paulownia', d:'Un bois très léger', ic:'panneau'},
      {t:'Panneaux de particules P5', d:'L’alternative à l’OSB 3', ic:'panneau'}
    ]},
    {k:'quincaillerie', t:'Quincaillerie et finitions', court:'Quincaillerie', d:'Vis, connecteurs, colles et huiles', img:'img/produits/visserie.jpg', produits:[
      {t:'Vis zinguées et inox', d:'Pour bardage, terrasse et parquet', img:'img/produits/visserie.jpg', prix:'dès 15,00 €', unite:'la boîte de 200', contenu:true, stock:true},
      {t:'Connecteurs et pieds de poteaux', d:'Équerres, sabots, pieds de poteaux', img:'img/produits/pieds-poteaux.jpg', contenu:true},
      {t:'Connecteurs 3D', d:'Pour les assemblages de poteaux et de poutres', ic:'connecteur'},
      {t:'Colles pour le bois', d:'Plinthes, parquets, menuiserie', ic:'colle', prix:'dès 6,90 €', unite:'la cartouche'},
      {t:'Huiles de protection', d:'Pour garder la couleur du bois', img:'img/produits/huiles.jpg'}
    ]},
    {k:'chauffage', t:'Chauffage et litières', court:'Chauffage', d:'Bûches, bûches densifiées, copeaux', img:'img/bois-chauffage.jpg', produits:[
      {t:'Bois de chauffage', d:'Douglas non traité', img:'img/bois-chauffage.jpg'},
      {t:'Bûches densifiées', d:'Pour poêles et cheminées', ic:'flamme'},
      {t:'Copeaux et litières Douglas', d:'Litières pour les animaux', ic:'copeaux'}
    ]},
    {k:'affaires', t:'Bonnes affaires', court:'Bonnes affaires', d:'Premier choix remisé, selon le stock', img:'img/depot-hangar-droite.png', produits:[
      {t:'Douglas choix 1 à −30 %', d:'Sur les longueurs de moins de 2 m, selon le stock', img:'img/depot-hangar-droite.png', badge:'−30 %'},
      {t:'Premier choix remisé', d:'Petites quantités, à saisir', ic:'etiquette'}
    ]}
  ];
  var SERVICES = [
    {t:'Prêt de remorque', d:'Gratuit dès 300 € d’achat, si vous avez un attelage', ic:'remorque'},
    {t:'Sapins de Noël', d:'En saison, de 1 à 3 m', img:'img/produits/sapins.jpg'}
  ];
  return {SECTIONS:SECTIONS, TARIF:TARIF, NOMS:NOMS, LONGUEURS:LONGUEURS, ICONES:ICONES, CATEGORIES:CATEGORIES, SERVICES:SERVICES};
})();
