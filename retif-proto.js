/* Maquette du futur site de la Scierie Rétif : comportement du prototype et du tableau de bord.
   Prix : tarif Douglas brut C18 de juin 2026 (site actuel de la scierie). Les demandes du tableau de bord sont des exemples. */
(function(){
'use strict';
var REDUIT = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

var D = window.RetifDonnees;   /* fichier retif-donnees.js, à charger avant celui-ci */
var SECTIONS = D.SECTIONS, LONGUEURS = D.LONGUEURS;
var MSG_FICHE = 'Dans la maquette, seule la fiche Douglas brut est détaillée.';
function norm(s){ return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
function vignette(p){ return p.img ? '<img src="' + p.img + '" alt="">' : '<svg viewBox="0 0 24 24" aria-hidden="true">' + D.ICONES[p.ic] + '</svg>'; }
function produitLigne(p){
  var act = p.go ? ' data-go="' + p.go + '"' + (p.sel ? ' data-sel="' + p.sel + '"' : '') + ' data-lab="Produits"' : ' data-toast="' + MSG_FICHE + '"';
  var px = p.prix ? '<span class="px">' + p.prix + ' <em>' + p.unite + '</em></span>' : '<span class="px doux">Prix sur la fiche</span>';
  return '<button class="m-prod" data-txt="' + norm(p.t + ' ' + p.d) + '"' + act + '><span class="th">' + vignette(p) + '</span><span><b>' + p.t + (p.badge ? ' <i class="m-badge">' + p.badge + '</i>' : '') + '</b><small>' + p.d + '</small>' + px + '</span><span class="chev">›</span></button>';
}
var PROJETS = [
  {t:'Terrasse', img:'terrasse-chantier.jpg', d:'lames, lambourdes, plots, vis', go:'terr'},
  {t:'Charpente et ossature', img:'stock-planches.jpg', d:'bastaings, chevrons, poutres', go:'prod'},
  {t:'Bardage', img:'terrasse-maison.jpg', d:'clin, lambris'},
  {t:'Abri et pergola', img:'kiosque.jpg', d:'poteaux, abris, connecteurs'},
  {t:'Plancher et intérieur', img:'ossature.jpg', d:'parquets, planches'},
  {t:'Bois de chauffage', img:'bois-chauffage.jpg', d:'bûches, bûches densifiées'}
];
var FAITS = [['1928', 'une scierie de famille'], ['Bois sec', 'stocké à l’abri'], ['Prix publics', 'TTC, sur le site'], ['Remorque', 'prêtée dès 300 € d’achat']];
var MSG_PAGE = 'Dans la maquette, seules la terrasse et la charpente sont détaillées.';

function fmt(n){
  var s = (Math.round(n * 100) / 100).toFixed(2).split('.');
  return s[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ',' + s[1];
}
function lenNum(l){ return parseFloat(l.replace(',', '.')); }
function compte(el, to, ms){
  var from = parseFloat(el.getAttribute('data-v') || '0');
  el.setAttribute('data-v', to);
  if (REDUIT || from === to || !ms){ el.textContent = fmt(to); return; }
  var t0 = performance.now();
  (function step(t){
    var p = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - p, 3);
    el.textContent = fmt(from + (to - from) * e);
    if (p < 1) requestAnimationFrame(step);
  })(t0);
}
function statut(d){
  var j = d.getDay(), m = d.getHours() * 60 + d.getMinutes();
  if (j >= 1 && j <= 5){
    if (m >= 480 && m < 780) return [true, 'Ouvert · ferme à 13 h'];
    if (m >= 840 && m < 1080) return [true, 'Ouvert · ferme à 18 h'];
    if (m < 480) return [false, 'Fermé · ouvre à 8 h'];
    if (m < 840) return [false, 'Fermé · ouvre à 14 h'];
    return [false, 'Fermé · ouvre demain à 8 h'];
  }
  if (j === 6){
    if (m >= 480 && m < 720) return [true, 'Ouvert · ferme à 12 h'];
    if (m < 480) return [false, 'Fermé · ouvre à 8 h'];
    return [false, 'Fermé · ouvre lundi à 8 h'];
  }
  return [false, 'Fermé · ouvre demain à 8 h'];
}
function heure(){ var d = new Date(); return d.getHours() + ':' + String(d.getMinutes()).padStart(2, '0'); }
function cernes(){
  var s = '<svg viewBox="0 0 80 80" aria-hidden="true">', rs = [36, 31, 26.5, 22, 18, 14.5];
  for (var i = 0; i < rs.length; i++){
    var r = rs[i], len = (2 * Math.PI * r).toFixed(0);
    s += '<circle cx="' + (40 + i * .35).toFixed(2) + '" cy="' + (40 - i * .25).toFixed(2) + '" r="' + r + '" style="--len:' + len + '; --i:' + i + '"/>';
  }
  return s + '</svg>';
}

/* ---------- Le site sur téléphone ---------- */
function gabarit(){
  var st = statut(new Date());
  var statusHTML = '<p class="a-status' + (st[0] ? '' : ' ferme') + '"><i></i><span class="js-status">' + st[1] + '</span></p>';
  var cart = '<button class="a-cart" data-open aria-label="Ma liste">Ma liste <b class="a-count js-count">0</b></button>';
  var mots = ['Le', 'bois', 'sec,', 'au', 'prix', 'de', 'la', 'scierie.'];
  var h = '<div class="app">';
  h += '<div class="a-sb"><span class="js-heure">' + heure() + '</span><span class="icons"><s></s><i></i></span></div>';

  /* Accueil */
  h += '<div class="view v-home actif" data-v="home"><div class="a-head"><span class="a-logo js-logo"><img src="img/logo-rond.png" alt="Scierie Rétif"></span><span class="a-brand">Scierie Rétif<small>Bois sec · prix directs</small></span>' + cart + '</div>';
  h += '<div class="a-scroll js-scroll-home">';
  h += '<section class="hero">' + statusHTML + '<h1 class="a-h1">' + mots.map(function(m, i){ return '<span class="w' + (i > 2 ? ' doux' : '') + '" style="--i:' + i + '">' + m + '</span>'; }).join(' ') + '</h1>' +
    '<p class="a-sub">Charpente, terrasse, bardage : du Douglas stocké à l’abri, prêt à partir. À 6 km d’Angers.</p>' +
    '<div class="a-ctas"><button class="btn1" data-go="prod" data-lab="Charpente">Voir les prix</button><button class="btn2" data-go="prod" data-lab="Charpente">Préparer ma liste</button></div>' +
    '<div class="hero-card"><img src="img/terrasse-jardin.jpg" alt="Terrasse en Douglas chez un client"><div class="seal">' + cernes() + '<div><b>1928</b><span>scierie<br>de famille</span></div></div></div></section>';
  h += '<section class="bloc reveal"><div class="bloc-h"><h2 class="sec-t">Votre projet</h2><span>Faites glisser</span></div><div class="pcar js-car">';
  PROJETS.forEach(function(p){
    var act = p.go ? ' data-go="' + p.go + '" data-lab="Accueil"' : ' data-toast="' + MSG_PAGE + '"';
    h += '<button class="pcard"' + act + '><div class="ph"><img src="img/' + p.img + '" alt=""></div><b>' + p.t + '</b><small>' + p.d + '</small></button>';
  });
  h += '</div></section>';
  h += '<section class="bloc reveal"><div class="bloc-h"><h2 class="sec-t">Nos produits</h2><button class="lien" data-go="cat" data-lab="Accueil">Tout voir ›</button></div><div class="cat-tiles">';
  D.CATEGORIES.forEach(function(c){ h += '<button class="cat-tile" data-go="cat" data-cat="' + c.k + '" data-lab="Accueil"><img src="' + c.img + '" alt=""><span>' + c.court + '</span></button>'; });
  h += '</div><button class="voir-tout" data-go="cat" data-lab="Accueil">Voir tous les produits</button></section>';
  h += '<section class="bloc reveal"><div class="facts">' + FAITS.map(function(f){ return '<div><b>' + f[0] + '</b><span>' + f[1] + '</span></div>'; }).join('') + '</div></section>';
  h += '<section class="bloc reveal"><div class="bloc-h"><h2 class="sec-t">Chez nos clients</h2><span>Réalisations</span></div><div class="gal"><div><img src="img/terrasse-jardin.jpg" alt=""></div><div><img src="img/kiosque.jpg" alt=""></div><div><img src="img/terrasse-garage.jpg" alt=""></div></div></section>';
  h += '<section class="bloc reveal"><div class="bloc-h"><h2 class="sec-t">Comment ça marche</h2></div><ol class="steps3"><li>Je fais ma liste sur le site, avec les prix.</li><li>Je reçois mon devis par mail.</li><li>Je viens chercher, ou un transporteur s’en charge.</li></ol></section>';
  h += '<section class="bloc reveal"><div class="bloc-h"><h2 class="sec-t">Nous trouver</h2></div><div class="trouver"><p><b>Les Cinq Routes</b>, 49070 Saint-Lambert-la-Potherie<br>Par la D56, à 500 m d’Atoll, à 6 km d’Angers</p>' +
    '<table><tr><td>Lundi au vendredi</td><td>8 h - 13 h · 14 h - 18 h</td></tr><tr><td>Samedi</td><td>8 h - 12 h</td></tr><tr><td>Retraits</td><td>jusqu’à 30 min avant la fermeture</td></tr></table>' +
    '<div class="a-ctas"><button class="btn1" data-toast="Appel du 02 41 48 00 68 (désactivé dans la maquette)">Appeler</button><button class="btn2" data-toast="Itinéraire dans Maps (désactivé dans la maquette)">Itinéraire</button></div></div></section>';
  h += '<div class="a-foot"><b>Scierie Rétif</b> · bois sec et prix directs depuis 1928 · 02 41 48 00 68<br>Maquette de proposition, ce n’est pas le site officiel.</div>';
  h += '</div></div>';

  /* Catalogue : nos produits */
  h += '<div class="view v-cat" data-v="cat"><div class="a-head"><button class="back" data-back><i>←</i><span class="js-backlab">Accueil</span></button>' + cart + '</div><div class="a-scroll js-scroll-cat"><div class="p-in">';
  h += '<h1>Nos produits</h1><p class="p-sub">Prix TTC, à emporter. Touchez un produit pour voir ses prix.</p>';
  h += '<label class="m-search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg><input type="search" class="js-q" placeholder="Bastaing, lame, vis…" aria-label="Rechercher un produit"></label>';
  h += '<div class="m-chips js-mchips"><button class="m-chip on" data-cf="">Tout</button>' + D.CATEGORIES.map(function(c){ return '<button class="m-chip" data-cf="' + c.k + '">' + c.court + '</button>'; }).join('') + '</div>';
  D.CATEGORIES.forEach(function(c){
    h += '<section class="m-cat" data-k="' + c.k + '"><div class="m-cat-h"><span class="rond"><img src="' + c.img + '" alt=""></span><b>' + c.t + '</b><span>' + c.produits.length + ' produits</span></div>';
    c.produits.forEach(function(p){ h += produitLigne(p); });
    h += '</section>';
  });
  h += '<p class="m-vide js-vide">Aucun produit ne correspond. Appelez-nous au 02 41 48 00 68.</p>';
  h += '<section class="m-serv"><b>Nos services</b>' + D.SERVICES.map(function(s){ return '<div class="m-prod sans"><span class="th">' + vignette(s) + '</span><span><b>' + s.t + '</b><small>' + s.d + '</small></span><span></span></div>'; }).join('') + '</section>';
  h += '</div></div></div>';

  /* Page projet : terrasse */
  h += '<div class="view v-terr" data-v="terr"><div class="a-head"><button class="back" data-back><i>←</i><span class="js-backlab">Accueil</span></button>' + cart + '</div><div class="a-scroll">';
  h += '<div class="p-top"><img src="img/terrasse-chantier.jpg" alt="Terrasse en cours de pose sur lambourdes et plots"></div><div class="p-in"><h1>Je fais une terrasse</h1><p class="p-sub">Tout ce qu’il faut, dans l’ordre du chantier.</p><ol class="t-list">' +
    '<li><div><b>Les plots réglables</b><p>Ils portent la structure et rattrapent un sol irrégulier. Jusqu’à une tonne par plot.</p><button class="t-link" data-toast="' + MSG_PAGE + '">Voir les plots</button></div></li>' +
    '<li><div><b>Les lambourdes en Douglas 50×75</b><p>La structure qui porte les lames, posée sur les plots.</p><button class="t-link prix" data-go="prod" data-sel="50x75" data-lab="Terrasse">Voir les prix</button></div></li>' +
    '<li><div><b>Les lames de terrasse Douglas</b><p>Lisses ou striées, épaisses de 25 mm, larges de 145 ou 200 mm.</p><button class="t-link" data-toast="' + MSG_PAGE + '">Voir les lames</button></div></li>' +
    '<li><div><b>Les vis inox et les espaceurs</b><p>Au moins 25 vis par m² avec des lames de 200 mm, et un espaceur pour deux vis.</p><button class="t-link" data-toast="' + MSG_PAGE + '">Voir la visserie</button></div></li>' +
    '<li><div><b>L’huile de protection</b><p>Elle garde la couleur du bois. Pensez aussi à traiter les coupes.</p><button class="t-link" data-toast="' + MSG_PAGE + '">Voir les huiles</button></div></li>' +
    '</ol><div class="t-astuce"><b>Le conseil de la scierie :</b> faites d’abord le plan de votre terrasse (le calepinage). Il donne le nombre exact de lames, de lambourdes et de plots.</div></div>';
  h += '</div></div>';

  /* Fiche produit */
  h += '<div class="view v-prod" data-v="prod"><div class="a-head"><button class="back" data-back><i>←</i><span class="js-backlab">Charpente</span></button>' + cart + '</div><div class="a-scroll js-scroll-prod">';
  h += '<div class="p-top"><img src="img/stock-planches.jpg" alt="Piles de Douglas sous le hangar"></div><div class="p-in"><h1>Douglas brut de sciage</h1><p class="p-sub">Sec, non traité · qualité C18</p>';
  h += '<p class="p-why"><b>C’est pour quoi faire ?</b> Charpente, ossature, clôture, abri.</p>';
  h += '<div class="lab">1. La section (épaisseur × largeur)</div><div class="chips js-chips"><span class="chip-ind"></span></div>';
  h += '<div class="sec-prev"><div class="sec-stage"><div class="sec-box js-box"><span class="sec-w js-sw"></span><span class="sec-h js-sh"></span></div></div><div class="sec-txt"><b class="js-nom"></b><span class="js-usage"></span><br><small>Dessin à l’échelle</small></div></div>';
  h += '<div class="lab">2. La longueur</div><div class="lcards js-lcards"></div>';
  h += '<span class="stock">En stock · à retirer aujourd’hui</span>';
  h += '<p class="help"><b>C18 ou C24 ?</b> Le C24 est plus solide et plus beau. Sur commande, +30 %.</p></div></div>';
  h += '<div class="buy"><button class="buy-list js-bar" data-open><span><b class="js-pieces">0</b> pièce(s) dans ma liste</span><span class="t"><span class="js-total" data-v="0">0,00</span> € ›</span></button>' +
    '<div class="buy-row"><div class="price"><b class="js-prix" data-v="0">0,00</b><span class="eur">€</span><small>la pièce · <span class="js-ml">0,00</span> € le mètre</small></div>' +
    '<div class="qty"><button data-q="-1" aria-label="Moins">−</button><output class="js-qte">10</output><button data-q="1" aria-label="Plus">+</button></div><button class="add js-add">Ajouter</button></div></div>';
  h += '</div>';

  /* Ma liste */
  h += '<div class="shade" data-close></div><div class="sheet"><div class="sh-grip"></div><div class="sh-body"><h3>Ma liste</h3><ul class="sh-items js-items"></ul>' +
    '<div class="sh-sum"><div><span>Total estimé TTC</span><b><span class="js-total2">0,00</span> €</b></div><div class="sh-meta js-meta"></div><div class="sh-rem js-rem"></div></div>' +
    '<div class="sh-opts"><button class="sh-opt on" data-opt>Je viens chercher</button><span class="o">ou</span><button class="sh-opt" data-opt>Transporteur</button></div>' +
    '<button class="sh-send" data-send>Envoyer ma demande de devis</button><p class="sh-note">Pas de paiement en ligne : la scierie vous envoie votre devis par mail.</p></div>' +
    '<div class="sh-ok"><svg viewBox="0 0 90 90"><circle cx="45" cy="45" r="38"/><path d="M28 46l12 12 22-25"/></svg><h3>C’est envoyé !</h3><p>La scierie prépare votre devis et vous l’envoie par mail.</p><button class="sh-send" data-done style="margin-top:14px">Fermer</button></div></div>';
  h += '<div class="a-toast js-toast"></div></div>';
  return h;
}

function Maquette(conteneur, opts){
  conteneur.innerHTML = gabarit();
  var app = conteneur.querySelector('.app');
  if (opts && opts.plein) app.classList.add('plein');
  var $ = function(s){ return app.querySelector(s); }, $$ = function(s){ return Array.prototype.slice.call(app.querySelectorAll(s)); };
  var etat = {sec:SECTIONS[1], len:'4,00', qte:10, liste:[]};
  var pile = ['home'];

  function echelle(){ var r = app.getBoundingClientRect(); return r.width / app.offsetWidth || 1; }
  function toast(t){ var e = $('.js-toast'); e.textContent = t; e.classList.add('on'); clearTimeout(e._t); e._t = setTimeout(function(){ e.classList.remove('on'); }, 2400); }
  function majVues(){
    $$('.view').forEach(function(v){
      var i = pile.indexOf(v.getAttribute('data-v'));
      v.classList.toggle('actif', i === pile.length - 1);
      v.classList.toggle('gauche', i > -1 && i < pile.length - 1);
    });
  }
  /* Fait défiler seulement la rangée de pastilles (jamais le téléphone entier) */
  function centrer(el){
    if (!el) return;
    var c = el.parentNode;
    var x = el.offsetLeft - (c.clientWidth - el.offsetWidth) / 2;
    if (c.scrollTo) c.scrollTo({left:Math.max(0, x), behavior: REDUIT ? 'auto' : 'smooth'}); else c.scrollLeft = Math.max(0, x);
  }
  function filtrer(){
    var q = norm($('.js-q').value.trim()), cf = etat.cf || '', total = 0;
    $$('.m-cat').forEach(function(sec){
      var okCat = !cf || sec.getAttribute('data-k') === cf, n = 0;
      Array.prototype.forEach.call(sec.querySelectorAll('.m-prod'), function(b){
        var ok = okCat && (!q || b.getAttribute('data-txt').indexOf(q) > -1);
        b.style.display = ok ? '' : 'none'; if (ok) n++;
      });
      sec.style.display = n ? '' : 'none'; total += n;
    });
    $('.js-vide').style.display = total ? 'none' : 'block';
  }
  function filtreCat(k){
    etat.cf = k || '';
    $$('[data-cf]').forEach(function(c){ c.classList.toggle('on', c.getAttribute('data-cf') === etat.cf); });
    centrer($('.m-chip.on'));
    filtrer();
  }
  function aller(v, lab, sel, cat){
    if (sel){ choisirSection(sel, false); }
    if (v === 'cat'){ $('.js-q').value = ''; filtreCat(cat); }
    if (lab) $$('.v-' + v + ' .js-backlab').forEach(function(e){ e.textContent = lab; });
    if (pile[pile.length - 1] !== v){ pile.push(v); majVues(); }
    app.scrollLeft = 0; app.scrollTop = 0;
    var sc = $('.v-' + v + ' .a-scroll'); if (sc) sc.scrollTop = 0;
    if (v === 'prod') setTimeout(placerInd, 40);
  }
  function retour(){ if (pile.length > 1){ pile.pop(); majVues(); } }

  function chips(){
    var c = $('.js-chips'), ind = c.querySelector('.chip-ind');
    c.innerHTML = ''; c.appendChild(ind);
    SECTIONS.forEach(function(s){
      var b = document.createElement('button');
      b.className = 'chip' + (s === etat.sec ? ' on' : '');
      b.setAttribute('data-sec', s.id);
      b.innerHTML = s.id.replace('x', '×') + '<small>' + s.nom + '</small>';
      c.appendChild(b);
    });
  }
  function placerInd(){
    var ind = $('.chip-ind'), on = $('.chip.on');
    if (!ind || !on) return;
    ind.style.width = on.offsetWidth + 'px';
    ind.style.transform = 'translateX(' + on.offsetLeft + 'px)';
  }
  function longueurs(){
    var dispo = Object.keys(etat.sec.prix);
    if (dispo.indexOf(etat.len) < 0) etat.len = dispo.indexOf('4,00') >= 0 ? '4,00' : dispo[0];
    var lc = $('.js-lcards');
    lc.innerHTML = '';
    dispo.forEach(function(l, i){
      var b = document.createElement('button');
      b.className = 'lcard in' + (l === etat.len ? ' on' : '');
      b.style.animationDelay = (i * 0.06) + 's';
      b.setAttribute('data-len', l);
      b.innerHTML = '<span>' + l + ' m</span><b>' + fmt(etat.sec.prix[l]) + ' €</b>';
      lc.appendChild(b);
    });
  }
  function section(){
    var s = etat.sec, k = 0.34, box = $('.js-box');
    box.style.width = Math.round(s.w * k) + 'px';
    box.style.height = Math.round(s.h * k) + 'px';
    $('.js-sw').textContent = s.w + ' mm';
    $('.js-sh').textContent = s.h + ' mm';
    $('.js-nom').textContent = s.nom + ' ' + s.id.replace('x', '×');
    $('.js-usage').textContent = s.usage;
  }
  function prix(anim){
    var p = etat.sec.prix[etat.len];
    compte($('.js-prix'), p, anim ? 480 : 0);
    $('.js-ml').textContent = fmt(p / lenNum(etat.len));
  }
  function choisirSection(id, anim){
    etat.sec = SECTIONS.filter(function(s){ return s.id === id; })[0];
    $$('.chip').forEach(function(c){ c.classList.toggle('on', c.getAttribute('data-sec') === id); });
    placerInd(); longueurs(); section(); prix(anim);
  }
  function totaux(anim){
    var pieces = 0, total = 0, vol = 0;
    etat.liste.forEach(function(it){ pieces += it.q; total += it.q * it.p; vol += it.q * (it.w / 1000) * (it.h / 1000) * lenNum(it.l); });
    $$('.js-count').forEach(function(e){ e.textContent = pieces; });
    $('.js-pieces').textContent = pieces;
    compte($('.js-total'), total, anim ? 600 : 0);
    $('.js-total2').textContent = fmt(total);
    $('.js-meta').textContent = pieces ? 'Poids ≈ ' + Math.round(vol * 530) + ' kg · volume ' + fmt(vol).replace(/0$/, '') + ' m³' : '';
    $('.js-rem').textContent = total >= 300 ? 'Prêt de remorque offert (dès 300 €)' : (pieces ? 'Encore ' + fmt(300 - total) + ' € pour la remorque offerte' : '');
    app.classList.toggle('has-items', pieces > 0);
    $('.js-items').innerHTML = etat.liste.map(function(it){
      return '<li><span>Douglas brut ' + it.s.replace('x', '×') + ' · ' + it.l + ' m</span><small>' + it.q + ' × ' + fmt(it.p) + ' €</small><b>' + fmt(it.q * it.p) + ' €</b></li>';
    }).join('');
  }
  function ajouter(){
    var btn = $('.js-add'), p = etat.sec.prix[etat.len], ex = null;
    etat.liste.forEach(function(it){ if (it.s === etat.sec.id && it.l === etat.len) ex = it; });
    btn.classList.add('done'); btn.textContent = 'Ajouté ✓';
    setTimeout(function(){ btn.classList.remove('done'); btn.textContent = 'Ajouter'; }, 1400);
    var avant = app.classList.contains('has-items');
    if (ex) ex.q += etat.qte; else etat.liste.push({s:etat.sec.id, w:etat.sec.w, h:etat.sec.h, l:etat.len, q:etat.qte, p:p});
    totaux(true);
    if (avant){ var bar = $('.js-bar'); bar.classList.remove('bump'); void bar.offsetWidth; bar.classList.add('bump'); }
    $$('.v-prod .a-cart').forEach(function(c){ c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump'); });
    if (REDUIT) return;
    var sc = echelle(), ra = app.getBoundingClientRect(), rb = btn.getBoundingClientRect();
    var f = document.createElement('div');
    f.className = 'fly'; f.textContent = '+' + etat.qte;
    app.appendChild(f);
    f.style.left = ((rb.left - ra.left) / sc + rb.width / sc / 2 - f.offsetWidth / 2) + 'px';
    f.style.top = ((rb.top - ra.top) / sc - 6) + 'px';
    f.animate([{transform:'translateY(0)', opacity:0}, {transform:'translateY(-18px)', opacity:1, offset:.3}, {transform:'translateY(-34px)', opacity:0}], {duration:900, easing:'cubic-bezier(.22,.61,.36,1)'}).finished.then(function(){ f.remove(); });
  }
  function ouvrir(o){
    if (o && !etat.liste.length){ toast('Votre liste est vide : choisissez une pièce, puis « Ajouter ».'); return; }
    app.classList.toggle('sheet-open', o);
    if (!o) setTimeout(function(){ app.classList.remove('sent'); }, 400);
  }

  app.addEventListener('click', function(e){
    var t = e.target.closest('[data-go],[data-back],[data-sec],[data-len],[data-q],.js-add,[data-open],[data-close],[data-send],[data-done],[data-opt],[data-toast],[data-cf]');
    if (!t) return;
    if (t.hasAttribute('data-go')) aller(t.getAttribute('data-go'), t.getAttribute('data-lab'), t.getAttribute('data-sel'), t.getAttribute('data-cat'));
    else if (t.hasAttribute('data-cf')) filtreCat(t.getAttribute('data-cf'));
    else if (t.hasAttribute('data-back')) retour();
    else if (t.hasAttribute('data-sec')){ choisirSection(t.getAttribute('data-sec'), true); centrer(t); }
    else if (t.hasAttribute('data-len')){ etat.len = t.getAttribute('data-len'); $$('[data-len]').forEach(function(c){ c.classList.toggle('on', c === t); }); prix(true); }
    else if (t.hasAttribute('data-q')){ etat.qte = Math.max(1, Math.min(99, etat.qte + parseInt(t.getAttribute('data-q'), 10))); $('.js-qte').textContent = etat.qte; }
    else if (t.classList.contains('js-add')) ajouter();
    else if (t.hasAttribute('data-open')) ouvrir(true);
    else if (t.hasAttribute('data-close')) ouvrir(false);
    else if (t.hasAttribute('data-send')) app.classList.add('sent');
    else if (t.hasAttribute('data-done')){ etat.liste = []; totaux(false); ouvrir(false); }
    else if (t.hasAttribute('data-opt')) $$('[data-opt]').forEach(function(c){ c.classList.toggle('on', c === t); });
    else if (t.hasAttribute('data-toast')) toast(t.getAttribute('data-toast'));
  });

  /* Mouvements liés au défilement : logo qui tourne comme une lame, photo qui glisse, sections qui apparaissent */
  var sh = $('.js-scroll-home'), logo = $('.js-logo'), hc = $('.hero-card'), car = $('.js-car');
  sh.addEventListener('scroll', function(){
    if (REDUIT) return;
    logo.style.transform = 'rotate(' + (sh.scrollTop * 0.45).toFixed(1) + 'deg)';
    hc.style.transform = 'translateY(' + Math.min(40, sh.scrollTop * 0.12).toFixed(1) + 'px)';
  }, {passive:true});
  var par = function(){
    var mid = car.scrollLeft + car.clientWidth / 2;
    Array.prototype.forEach.call(car.querySelectorAll('.pcard'), function(c){
      var d = (c.offsetLeft + c.offsetWidth / 2 - mid) / car.clientWidth;
      c.querySelector('img').style.transform = 'scale(1.18) translateX(' + (-d * 22).toFixed(1) + 'px)';
    });
  };
  car.addEventListener('scroll', par, {passive:true}); par();
  var io = null;
  function observer(){
    var els = $$('.reveal');
    if (!('IntersectionObserver' in window) || REDUIT){ els.forEach(function(e){ e.classList.add('vu'); }); return; }
    if (io) io.disconnect();
    io = new IntersectionObserver(function(es){ es.forEach(function(en){ if (en.isIntersecting){ en.target.classList.add('vu'); io.unobserve(en.target); } }); }, {root:sh, threshold:.12});
    els.forEach(function(e){ io.observe(e); });
  }

  $('.js-q').addEventListener('input', filtrer);
  chips(); section(); longueurs(); prix(false); totaux(false); observer();
  setTimeout(placerInd, 60);
  setInterval(function(){
    $$('.js-heure').forEach(function(e){ e.textContent = heure(); });
    var s = statut(new Date());
    $$('.a-status').forEach(function(e){ e.classList.toggle('ferme', !s[0]); e.querySelector('.js-status').textContent = s[1]; });
  }, 30000);

  return {
    jouer: function(){ app.classList.remove('play'); void app.offsetWidth; app.classList.add('play'); },
    accueil: function(){
      ouvrir(false); pile = ['home']; majVues(); sh.scrollTop = 0; logo.style.transform = ''; hc.style.transform = '';
      $$('.reveal').forEach(function(e){ e.classList.remove('vu'); }); observer();
    }
  };
}

/* ---------- Tableau de bord ---------- */
var STATUTS = ['Nouvelle', 'Devis envoyé', 'Payée', 'Prête', 'Retirée'];
var ACTIONS = [
  ['Envoyer le devis', 'devis envoyé par mail, avec le lien de paiement.'],
  ['Marquer comme payée', 'paiement noté, le client reçoit la confirmation.'],
  ['Commande prête : prévenir le client', 'client prévenu par mail et par SMS, sa commande l’attend.'],
  ['Marquer comme retirée', 'commande terminée, rangée dans l’historique.']
];
var DEMANDES = [
  {id:1042, nom:'Thomas R.', type:'Particulier', ville:'Beaucouzé', quand:'aujourd’hui, 9 h 12', statut:0, retrait:'samedi matin, avec la remorque', lignes:[['63x175', '4,00', 10, 33.18], ['50x75', '3,00', 20, 9.74]]},
  {id:1041, nom:'Marc L.', type:'Artisan charpentier', ville:'Cholet', quand:'aujourd’hui, 8 h 05', statut:1, retrait:'transporteur', lignes:[['75x225', '6,00', 8, 82.76], ['100x100', '3,00', 12, 27.26]]},
  {id:1040, nom:'Claire B.', type:'Particulier', ville:'Avrillé', quand:'hier, 17 h 40', statut:2, retrait:'jeudi après-midi', lignes:[['27x200', '4,00', 25, 19.80]]},
  {id:1039, nom:'Julie P.', type:'Particulier', ville:'Angers', quand:'hier, 11 h 02', statut:3, retrait:'vendredi matin', lignes:[['150x150', '3,00', 4, 58.67], ['100x100', '2,50', 6, 22.72]]}
];
var CHANGEMENTS = [
  ['Bastaing 63×175', '4,00 m', 33.18, 34.18], ['Bastaing 63×175', '5,00 m', 41.47, 42.71], ['Chevron 50×75', '3,00 m', 9.74, 10.03],
  ['Chevron 50×75', '4,00 m', 12.98, 13.37], ['Poteau 100×100', '3,00 m', 27.26, 28.08], ['Madrier 75×225', '6,00 m', 82.76, 85.24]
];
var NAV = [
  ['jour', 'Aujourd’hui', '<path d="M3 11 12 4l9 7v9H3z"/><path d="M9 20v-6h6v6"/>'],
  ['dem', 'Demandes de devis', '<path d="M4 5h16v11H8l-4 4z"/><path d="M8 9h8M8 12h5"/>'],
  ['tar', 'Tarifs et stock', '<path d="M4 4h10l6 6v10H4z"/><path d="M14 4v6h6M8 13h8M8 17h5"/>'],
  ['pro', 'Produits et pages', '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 4v5"/>'],
  ['hor', 'Horaires', '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'],
  ['sta', 'Statistiques', '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>']
];
function secData(id){ return SECTIONS.filter(function(s){ return s.id === id; })[0]; }
function totalDem(d){ return d.lignes.reduce(function(a, l){ return a + l[2] * l[3]; }, 0); }
function poidsDem(d){ return d.lignes.reduce(function(a, l){ var s = secData(l[0]); return a + l[2] * s.w / 1000 * s.h / 1000 * lenNum(l[1]) * 530; }, 0); }

function Tableau(root){
  var sel = 0;
  var h = '<aside class="d-side"><div class="d-logo"><img src="img/logo-rond.png" alt=""><div><b>Scierie Rétif</b><small>Gestion du site</small></div></div>';
  NAV.forEach(function(n, i){ h += '<button class="d-nav' + (i === 0 ? ' on' : '') + '" data-v="' + n[0] + '"><svg viewBox="0 0 24 24">' + n[2] + '</svg>' + n[1] + (n[0] === 'dem' ? '<span class="bdg js-bdg">1</span>' : '') + '</button>'; });
  h += '<span class="sp"></span><span class="d-see">Voir le site ↗</span></aside><div class="d-main">';
  h += '<section class="d-view on" data-view="jour"><div class="d-h"><div><h3>Bonjour, voici votre journée</h3><p>Tout ce qui demande une action, en un coup d’œil.</p></div><button class="d-btn" data-goto="dem">Voir les demandes</button></div>' +
    '<div class="d-kpis"><button class="d-card d-kpi" data-goto="dem"><b class="js-k0">1</b><span>nouvelle(s) demande(s) de devis</span></button><button class="d-card d-kpi" data-goto="dem"><b class="js-k1">1</b><span>devis en attente de paiement</span></button><button class="d-card d-kpi" data-goto="dem"><b class="js-k2">1</b><span>commande(s) à préparer</span></button><button class="d-card d-kpi" data-goto="tar"><b>Juin</b><span>dernière mise à jour des tarifs</span></button></div>' +
    '<div class="d-two"><div class="d-card"><div class="d-ttl">Dernières demandes</div><ul class="d-list js-jlist"></ul></div><div class="d-card"><div class="d-ttl">Sur le site en ce moment</div><ul class="d-list"><li><div class="who"><b>' + statut(new Date())[1] + '</b><small>calculé tout seul à partir de vos horaires</small></div></li><li><div class="who"><b>Sapins de Noël</b><small>actualité en ligne</small></div><span class="tg"></span></li><li><div class="who"><b>Bonnes affaires : Douglas choix 1 à −30 %</b><small>bandeau en page d’accueil</small></div><span class="tg"></span></li></ul></div></div></section>';
  h += '<section class="d-view" data-view="dem"><div class="d-h"><div><h3>Demandes de devis</h3><p>Chaque « Ma liste » envoyée depuis le site arrive ici.</p></div></div><div class="d-req"><div class="d-card d-reqlist js-rlist"></div><div class="d-card d-detail js-detail"></div></div></section>';
  h += '<section class="d-view" data-view="tar"><div class="d-h"><div><h3>Tarifs et stock</h3><p>Mettez votre fichier de tarifs à jour comme d’habitude, puis déposez-le ici.</p></div></div>' +
    '<div class="d-card" style="padding:16px"><div class="d-drop js-drop"><span class="ic">XLS</span><div><b class="js-dt">Déposez votre fichier de tarifs ici</b><small class="js-ds">Dernier fichier : tarif-douglas-brut.xlsx, juin 2026</small><div class="d-prog js-prog"><i></i></div></div><button class="d-btn js-sim">Simuler un dépôt</button></div>' +
    '<div class="d-diff js-diff"><div class="sum"><span>6 prix modifiés</span><span>1 nouvelle longueur</span><span>0 erreur</span></div><table class="d-tab"><thead><tr><th>Pièce</th><th>Longueur</th><th class="n">Avant</th><th class="n">Après</th><th class="n">Écart</th></tr></thead><tbody>' +
    CHANGEMENTS.map(function(c){ return '<tr><td>' + c[0] + '</td><td>' + c[1] + '</td><td class="n old">' + fmt(c[2]) + ' €</td><td class="n new">' + fmt(c[3]) + ' €</td><td class="n pct">+' + ((c[3] / c[2] - 1) * 100).toFixed(1).replace('.', ',') + ' %</td></tr>'; }).join('') +
    '<tr class="nv"><td>Bastaing 63×175</td><td>6,00 m</td><td class="n old">—</td><td class="n new">50,95 €</td><td class="n">nouvelle</td></tr></tbody></table>' +
    '<div class="d-acts" style="margin-top:12px"><button class="d-btn js-pub">Publier sur le site</button><button class="d-btn ghost js-annul">Annuler</button><span class="exemple">Prix d’exemple</span></div></div><div class="d-ok js-ok">C’est en ligne : le site et « Ma liste » affichent les nouveaux prix. Google les verra à son prochain passage.</div></div>' +
    '<div class="d-card d-stock"><div class="d-ttl">Stock du Douglas brut : touchez une case pour la changer</div><table class="d-tab"><thead><tr><th>Section</th>' + LONGUEURS.map(function(l){ return '<th>' + l + ' m</th>'; }).join('') + '</tr></thead><tbody>' +
    SECTIONS.map(function(s){ return '<tr><td><b>' + s.id.replace('x', '×') + '</b> ' + s.nom + '</td>' + LONGUEURS.map(function(l){
      if (!s.prix[l]) return '<td style="color:var(--d-muted)">—</td>';
      var e = (s.id === '75x225' && l === '6,00') ? 'sc' : (s.id === '150x150' && l === '4,00') ? 'se' : 'ss';
      return '<td><button class="' + e + '" data-stk>' + ({ss:'En stock', sc:'Sur commande', se:'Épuisé'})[e] + '</button></td>'; }).join('') + '</tr>'; }).join('') +
    '</tbody></table></div></section>';
  h += '<section class="d-view" data-view="pro"><div class="d-h"><div><h3>Produits et pages</h3><p>Photos, textes et visibilité : tout se modifie ici.</p></div><button class="d-btn">Ajouter une photo de chantier</button></div><div class="d-prods">' +
    [['Douglas brut', 'stock-planches.jpg', '34 sections'], ['Lames de terrasse', 'terrasse-chantier.jpg', 'Douglas et robinier'], ['Bardage', 'terrasse-maison.jpg', 'clin, lambris'], ['Abris et pergolas', 'kiosque.jpg', 'abris et poteaux'], ['Bois de chauffage', 'bois-chauffage.jpg', 'bûches, bûches densifiées'], ['Plancher', 'ossature.jpg', 'parquets, planches']].map(function(p, i){
      return '<div class="d-card d-prod"><div class="ph"><img src="img/' + p[1] + '" alt=""></div><div class="t"><div><b>' + p[0] + '</b><br><small style="color:var(--d-muted)">' + p[2] + '</small></div><span class="tg' + (i === 5 ? ' off' : '') + '"></span></div></div>'; }).join('') +
    '</div></section>';
  h += '<section class="d-view" data-view="hor"><div class="d-h"><div><h3>Horaires et fermetures</h3><p>Le site affiche tout seul si vous êtes ouverts.</p></div></div><div class="d-hours"><div class="d-card"><table class="d-tab"><tbody>' +
    [['Lundi au vendredi', '8 h - 13 h · 14 h - 18 h'], ['Samedi', '8 h - 12 h'], ['Dimanche', 'Fermé'], ['Retraits', 'jusqu’à 30 min avant la fermeture']].map(function(r){ return '<tr><td><b>' + r[0] + '</b></td><td>' + r[1] + '</td></tr>'; }).join('') +
    '</tbody></table></div><div class="d-card d-pv"><b>Fermeture exceptionnelle</b><p style="margin:4px 0 0; color:var(--d-muted)">Du mercredi 24 décembre au jeudi 1er janvier (exemple).</p><div class="mini">Ce que verront vos clients pendant la fermeture : <b>Fermé · rouvre le vendredi 2 janvier à 8 h</b></div></div></div></section>';
  h += '<section class="d-view" data-view="sta"><div class="d-h"><div><h3>Statistiques</h3><p>Mesurées automatiquement, sans rien compter à la main.</p></div><span class="exemple">Données d’exemple</span></div>' +
    '<div class="d-kpis"><div class="d-card d-kpi"><b>1 240</b><span>visites cette semaine</span><small>+18 % sur la semaine passée</small></div><div class="d-card d-kpi"><b>23</b><span>demandes de devis</span><small>+5</small></div><div class="d-card d-kpi"><b>61 %</b><span>des visites depuis un téléphone</span></div><div class="d-card d-kpi"><b>412 €</b><span>liste moyenne envoyée</span></div></div>' +
    '<div class="d-two"><div class="d-card" style="padding:14px 16px"><div class="d-ttl" style="padding:0 0 10px">Les plus ajoutés aux listes</div><div class="d-bars">' +
    [['Bastaing 63×175', 100, 41], ['Lames de terrasse', 83, 34], ['Chevron 50×75', 61, 25], ['Poteau 100×100', 44, 18], ['Bardage clin', 29, 12]].map(function(b){ return '<div class="b"><span>' + b[0] + '</span><i style="--w:' + b[1] + '"></i><span>' + b[2] + '</span></div>'; }).join('') +
    '</div></div><div class="d-card"><div class="d-ttl">Ce que les gens tapent dans Google</div><ul class="d-list">' +
    [['scierie angers', 312], ['bastaing douglas prix', 96], ['lame terrasse douglas', 88], ['bois de chauffage angers', 54]].map(function(q){ return '<li><div class="who"><b>' + q[0] + '</b></div><span style="font-weight:800">' + q[1] + ' visites</span></li>'; }).join('') +
    '</ul></div></div></section>';
  h += '<div class="d-toast js-toast"></div></div>';
  root.innerHTML = h;
  var $ = function(s){ return root.querySelector(s); }, $$ = function(s){ return Array.prototype.slice.call(root.querySelectorAll(s)); };

  function toast(t){ var e = $('.js-toast'); e.textContent = t; e.classList.add('on'); clearTimeout(e._t); e._t = setTimeout(function(){ e.classList.remove('on'); }, 2600); }
  function vue(v){ $$('.d-nav').forEach(function(b){ b.classList.toggle('on', b.getAttribute('data-v') === v); }); $$('.d-view').forEach(function(s){ s.classList.toggle('on', s.getAttribute('data-view') === v); }); }
  function liste(){
    $('.js-rlist').innerHTML = DEMANDES.map(function(d, i){
      return '<button class="' + (i === sel ? 'on' : '') + '" data-r="' + i + '"><b>' + d.nom + ' · ' + d.ville + '</b><span class="tot">' + fmt(totalDem(d)) + ' €<span class="chipst st' + d.statut + '">' + STATUTS[d.statut] + '</span></span><small>#' + d.id + ' · ' + d.quand + '</small></button>';
    }).join('');
    $('.js-jlist').innerHTML = DEMANDES.slice(0, 3).map(function(d){ return '<li><div class="who"><b>' + d.nom + ' · ' + d.ville + '</b><small>' + d.lignes.length + ' ligne(s) · ' + fmt(totalDem(d)) + ' €</small></div><span class="chipst st' + d.statut + '">' + STATUTS[d.statut] + '</span></li>'; }).join('');
    var nouv = DEMANDES.filter(function(d){ return d.statut === 0; }).length;
    $('.js-bdg').textContent = nouv; $('.js-bdg').style.display = nouv ? '' : 'none';
    $('.js-k0').textContent = nouv;
    $('.js-k1').textContent = DEMANDES.filter(function(d){ return d.statut === 1; }).length;
    $('.js-k2').textContent = DEMANDES.filter(function(d){ return d.statut === 2; }).length;
  }
  function detail(anim){
    var d = DEMANDES[sel];
    var lignes = d.lignes.map(function(l){ var s = secData(l[0]); return '<tr><td>Douglas brut ' + l[0].replace('x', '×') + ' <small style="color:var(--d-muted)">' + s.nom + '</small></td><td>' + l[1] + ' m</td><td class="n">' + l[2] + '</td><td class="n">' + fmt(l[3]) + ' €</td><td class="n"><b>' + fmt(l[2] * l[3]) + ' €</b></td></tr>'; }).join('');
    var tlh = '<div class="tl"><span class="bar js-tlbar"></span>' + STATUTS.map(function(s, i){ return '<div class="' + (i < d.statut ? 'done' : '') + (i === d.statut ? ' cur' : '') + '"><i></i>' + s + '</div>'; }).join('') + '</div>';
    var act = d.statut < 4 ? '<button class="d-btn js-act">' + ACTIONS[d.statut][0] + '</button>' : '<span class="chipst st4">Terminée</span>';
    $('.js-detail').innerHTML = '<h4>' + d.nom + ' · demande #' + d.id + '</h4><p class="meta">' + d.type + ' · ' + d.ville + ' · reçue ' + d.quand + ' · 06 •• •• •• 12</p>' + tlh +
      '<table class="d-tab"><thead><tr><th>Pièce</th><th>Longueur</th><th class="n">Qté</th><th class="n">Prix</th><th class="n">Total</th></tr></thead><tbody>' + lignes + '</tbody></table>' +
      '<div class="d-tot"><span>Total TTC</span><b>' + fmt(totalDem(d)) + ' €</b></div>' +
      '<div class="d-facts"><span>Poids ≈ ' + Math.round(poidsDem(d)) + ' kg</span><span>Retrait : ' + d.retrait + '</span>' + (totalDem(d) >= 300 ? '<span>Remorque offerte</span>' : '') + '</div>' +
      '<div class="d-acts">' + act + '<button class="d-btn ghost">Appeler</button><button class="d-btn ghost">Devis en PDF</button></div>';
    var bar = $('.js-tlbar'), w = d.statut / 4 * 80;
    if (anim){ bar.style.width = Math.max(0, (d.statut - 1) / 4 * 80) + '%'; requestAnimationFrame(function(){ requestAnimationFrame(function(){ bar.style.width = w + '%'; }); }); }
    else bar.style.width = w + '%';
  }
  root.addEventListener('click', function(e){
    var t = e.target.closest('[data-v],[data-goto],[data-r],.js-act,.js-sim,.js-pub,.js-annul,[data-stk]');
    if (!t) return;
    if (t.hasAttribute('data-v')) vue(t.getAttribute('data-v'));
    else if (t.hasAttribute('data-goto')) vue(t.getAttribute('data-goto'));
    else if (t.hasAttribute('data-r')){ sel = +t.getAttribute('data-r'); liste(); detail(false); }
    else if (t.classList.contains('js-act')){ var d = DEMANDES[sel], msg = ACTIONS[d.statut][1]; d.statut++; liste(); detail(true); toast(d.nom.split(' ')[0] + ' : ' + msg); }
    else if (t.classList.contains('js-sim')){
      var drop = $('.js-drop'), prog = $('.js-prog'), bi = prog.querySelector('i');
      drop.classList.add('hot'); $('.js-dt').textContent = 'tarif-douglas-brut-2027.xlsx'; $('.js-ds').textContent = 'Lecture du fichier…';
      prog.style.display = 'block'; bi.style.width = '0';
      requestAnimationFrame(function(){ requestAnimationFrame(function(){ bi.style.width = '100%'; }); });
      $('.js-ok').classList.remove('on'); $('.js-diff').classList.remove('on');
      setTimeout(function(){ drop.classList.remove('hot'); $('.js-ds').textContent = '34 sections lues, 7 changements trouvés'; $('.js-diff').classList.add('on'); }, REDUIT ? 10 : 1300);
    }
    else if (t.classList.contains('js-pub')){ $('.js-diff').classList.remove('on'); $('.js-ok').classList.add('on'); $('.js-ds').textContent = 'En ligne depuis à l’instant'; $('.js-prog').style.display = 'none'; toast('Tarifs publiés sur le site'); }
    else if (t.classList.contains('js-annul')){ $('.js-diff').classList.remove('on'); $('.js-prog').style.display = 'none'; $('.js-dt').textContent = 'Déposez votre fichier de tarifs ici'; $('.js-ds').textContent = 'Dernier fichier : tarif-douglas-brut.xlsx, juin 2026'; }
    else if (t.hasAttribute('data-stk')){
      var ordre = ['ss', 'sc', 'se'], noms = {ss:'En stock', sc:'Sur commande', se:'Épuisé'};
      var c = ordre.filter(function(o){ return t.classList.contains(o); })[0] || 'ss', nx = ordre[(ordre.indexOf(c) + 1) % 3];
      t.classList.remove(c); t.classList.add(nx); t.textContent = noms[nx];
    }
  });
  liste(); detail(false);
}

function TableauTel(root){
  var d = {statut:2};
  function rendre(){
    root.innerHTML = '<div class="dp"><div class="ttl">Demande #1040</div><h4>Claire B. · Avrillé</h4>' +
      '<div class="d-card"><div class="ln"><span>Douglas brut 27×200 · 4,00 m</span><b>× 25</b></div><div class="ln" style="border:0"><span>Total TTC</span><b>495,00 €</b></div></div>' +
      '<div class="d-card"><div class="ln" style="border:0"><span>Retrait</span><b>Jeudi après-midi</b></div><div class="ln" style="border:0"><span>Statut</span><span class="chipst st' + d.statut + '">' + STATUTS[d.statut] + '</span></div></div>' +
      (d.statut === 2 ? '<button class="d-btn big js-pret">Commande prête : prévenir Claire</button>' : '<button class="d-btn big js-reset">Recommencer la démo</button>') +
      '<button class="d-btn ghost big">Appeler Claire</button><div class="d-toast js-tt">Claire est prévenue par mail et par SMS.</div></div>';
  }
  root.addEventListener('click', function(e){
    if (e.target.closest('.js-pret')){ d.statut = 3; rendre(); var t = root.querySelector('.js-tt'); requestAnimationFrame(function(){ t.classList.add('on'); }); setTimeout(function(){ t.classList.remove('on'); }, 2600); }
    if (e.target.closest('.js-reset')){ d.statut = 2; rendre(); }
  });
  rendre();
}

/* ---------- Mise à l'échelle et démarrage ---------- */
function ajuster(){
  Array.prototype.forEach.call(document.querySelectorAll('.fit'), function(f){
    var s = Math.min(1, f.clientWidth / 376);
    f.querySelector('.phone-scale').style.setProperty('--s', s);
    f.style.height = (796 * s) + 'px';
  });
  Array.prototype.forEach.call(document.querySelectorAll('.dfit'), function(d){
    var ds = Math.min(1, d.clientWidth / 1120);
    d.querySelector('.dscale').style.setProperty('--ds', ds);
    d.style.height = (720 * ds) + 'px';
  });
  Array.prototype.forEach.call(document.querySelectorAll('.ifit'), function(d){
    var is = Math.min(1, d.clientWidth / 1280);
    d.querySelector('.iscale').style.setProperty('--is', is);
    d.style.height = (840 * is) + 'px';
  });
}

window.RetifProto = {Maquette:Maquette, Tableau:Tableau, TableauTel:TableauTel, ajuster:ajuster};

document.addEventListener('DOMContentLoaded', function(){
  window.addEventListener('resize', ajuster);
  ajuster();
  var registre = [];
  Array.prototype.forEach.call(document.querySelectorAll('[data-proto="app"]'), function(el){
    var m = Maquette(el, {plein: el.hasAttribute('data-plein')});
    registre.push(m);
    el._maquette = m;
    if (el.hasAttribute('data-plein') || !('IntersectionObserver' in window)) { m.jouer(); return; }
    var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting){ m.jouer(); io.disconnect(); } }); }, {threshold:.35});
    io.observe(el);
  });
  Array.prototype.forEach.call(document.querySelectorAll('[data-proto="dash"]'), function(el){ Tableau(el); });
  Array.prototype.forEach.call(document.querySelectorAll('[data-proto="dashtel"]'), function(el){ TableauTel(el); });
  document.addEventListener('click', function(e){
    var r = e.target.closest('[data-replay]'), z = e.target.closest('[data-reset]');
    var m = registre[0];
    if (!m) return;
    if (r){ m.accueil(); setTimeout(m.jouer, 60); }
    if (z) m.accueil();
  });
  ajuster();
});
})();
