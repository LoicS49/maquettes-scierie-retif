/* Scierie Rétif — comportement commun du site (maquette v2).
   À charger après donnees.js. Chaque page contient :
     <body data-page="accueil|produits|produit|projets|conseils|realisations|scierie|contact">
     <header data-entete></header> … <footer data-pied></footer>
   Outils disponibles pour les pages : window.RetifSite (voir en bas du fichier). */
(function(){
'use strict';
var D = window.RetifDonnees, I = D.INFOS;
var REDUIT = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var $ = function(s, r){ return (r || document).querySelector(s); };
var $$ = function(s, r){ return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
var MSG_FICHE = 'Dans la maquette, seule la fiche Douglas brut est détaillée.';

/* ---------- Outils ---------- */
function fmt(n){ var s = (Math.round(n * 100) / 100).toFixed(2).split('.'); return s[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ',' + s[1]; }
function lenNum(l){ return parseFloat(String(l).replace(',', '.')); }
function norm(s){ return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
function compte(el, to, ms){
  var from = parseFloat(el.getAttribute('data-v') || '0'); el.setAttribute('data-v', to);
  if (REDUIT || from === to || !ms){ el.textContent = fmt(to); return; }
  var t0 = performance.now();
  (function step(t){ var p = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - p, 3); el.textContent = fmt(from + (to - from) * e); if (p < 1) requestAnimationFrame(step); })(t0);
}
function statut(d){
  d = d || new Date();
  var j = d.getDay(), m = d.getHours() * 60 + d.getMinutes();
  if (j >= 1 && j <= 5){ if (m >= 480 && m < 780) return [true, 'Ouvert · ferme à 13 h']; if (m >= 840 && m < 1080) return [true, 'Ouvert · ferme à 18 h']; if (m < 480) return [false, 'Fermé · ouvre à 8 h']; if (m < 840) return [false, 'Fermé · ouvre à 14 h']; return [false, 'Fermé · ouvre demain à 8 h']; }
  if (j === 6){ if (m >= 480 && m < 720) return [true, 'Ouvert · ferme à 12 h']; if (m < 480) return [false, 'Fermé · ouvre à 8 h']; return [false, 'Fermé · ouvre lundi à 8 h']; }
  return [false, 'Fermé · ouvre demain à 8 h'];
}
function icone(k){ return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (D.ICONES[k] || '') + '</svg>'; }
function vignette(p){ return p.img ? '<img src="' + p.img + '" alt="">' : icone(p.ic); }
function toast(t){ var e = $('.r-toast'); if (!e) return; e.textContent = t; e.classList.add('on'); clearTimeout(e._t); e._t = setTimeout(function(){ e.classList.remove('on'); }, 2600); }
function stockage(){ try { var k = '__t'; localStorage.setItem(k, k); localStorage.removeItem(k); return localStorage; } catch (e) { return null; } }
var LS = stockage();

/* Carte produit commune (catalogue, accueil, produits associés) */
function carteProduit(p){
  var act = p.go ? ' data-aller="' + p.go + '"' : ' data-toast="' + MSG_FICHE + '"';
  var px = p.prix ? '<span class="r-prix">' + p.prix + ' <em>' + p.unite + '</em></span>' : '<span class="r-prix r-prix--doux">Prix sur la fiche</span>';
  return '<article class="r-carte" role="button" tabindex="0" data-txt="' + norm(p.t + ' ' + p.d) + '"' + act + '><div class="r-carte-img">' + vignette(p) +
    (p.badge ? '<span class="r-badge">' + p.badge + '</span>' : '') + (p.stock ? '<span class="r-dispo">En stock</span>' : '') +
    '</div><div class="r-carte-corps"><h3>' + p.t + '</h3><p>' + p.d + '</p><div class="r-carte-pied">' + px + '<span class="r-voir">Voir</span></div></div></article>';
}

/* ---------- En-tête et pied de page ---------- */
var NAV = [['produits', 'Produits', 'produits.html'], ['projets', 'Projets', 'terrasse.html'], ['conseils', 'Conseils', 'conseils.html'], ['realisations', 'Réalisations', 'realisations.html'], ['scierie', 'La scierie', 'la-scierie.html'], ['contact', 'Contact', 'contact.html']];
function entete(){
  var page = document.body.getAttribute('data-page') || '';
  var actif = function(k){ return (k === page || (k === 'produits' && page === 'produit')) ? ' on' : ''; };
  var mega = D.CATEGORIES.map(function(c){ return '<a href="produits.html#' + c.k + '"><span class="mi"><img src="' + c.img + '" alt=""></span><b>' + c.t + '</b><small>' + c.d + '</small></a>'; }).join('') + '<a class="tout" href="produits.html"><span>Tous les produits</span><span>›</span></a>';
  var nav = NAV.map(function(n){
    if (n[0] === 'produits') return '<div class="r-nav-item"><a class="r-nav-l' + actif(n[0]) + '" href="' + n[2] + '">' + n[1] + ' <i>▾</i></a><div class="r-mega">' + mega + '</div></div>';
    return '<a class="r-nav-l' + actif(n[0]) + '" href="' + n[2] + '">' + n[1] + '</a>';
  }).join('');
  return '<div class="r-topbar"><div class="r-wrap"><span><b>Les Cinq Routes</b>, Saint-Lambert-la-Potherie · à 6 km d’Angers</span><span class="r-tel">' + I.tel + '</span><span class="r-statut js-statut"><i></i><span class="js-statut-txt"></span></span><span class="sp"></span><span class="r-maquette">Maquette<span class="r-maquette-suite"> de proposition</span></span></div></div>' +
    '<div class="r-hd"><div class="r-wrap r-hd-in"><a class="r-logo" href="index.html"><span class="r-logo-rond js-logo"><img src="img/logo-rond.png" alt="Scierie Rétif"></span><span><b>Scierie Rétif</b><small>Prix directs de scierie depuis 1928</small></span></a>' +
    '<nav class="r-nav" aria-label="Menu principal">' + nav + '</nav>' +
    '<button class="r-icone-btn" data-ouvrir-recherche aria-label="Rechercher"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg></button>' +
    '<button class="r-liste-btn js-liste-btn" data-ouvrir-liste>Ma liste <b class="js-nb">0</b></button>' +
    '<button class="r-icone-btn r-burger" data-ouvrir-menu aria-label="Menu"><svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button></div></div>';
}
function pied(){
  var h = I.horaires.map(function(r){ return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td></tr>'; }).join('');
  return '<div class="r-pied"><div class="r-wrap">' +
    '<div class="r-pied-haut">' +
      '<div><a class="r-logo" href="index.html"><span class="r-logo-rond"><img src="img/logo-rond.png" alt=""></span><span><b>Scierie Rétif</b><small>Depuis 1928</small></span></a><p class="r-pied-slogan">' + I.slogan + '</p><p>' + I.sousSlogan + '. Pour les professionnels comme pour les particuliers.</p>' +
        '<div class="r-pied-reseaux"><img src="img/france-douglas.jpg" alt="France Douglas"><a href="' + I.reseaux.facebook + '" target="_blank" rel="noopener">Facebook</a><a href="' + I.reseaux.instagram + '" target="_blank" rel="noopener">Instagram</a></div></div>' +
      '<div><h4>Produits</h4><ul>' + D.CATEGORIES.map(function(c){ return '<li><a href="produits.html#' + c.k + '">' + c.t + '</a></li>'; }).join('') + '</ul></div>' +
      '<div><h4>La scierie</h4><ul><li><a href="la-scierie.html">Qui sommes-nous</a></li><li><a href="realisations.html">Réalisations et actualités</a></li><li><a href="conseils.html">Conseils et guides</a></li><li><a href="terrasse.html">Projet terrasse</a></li><li><a href="contact.html">Contact et commande</a></li></ul></div>' +
      '<div class="r-horaires"><div class="r-horaires-titre"><span>Horaires</span><span class="r-statut js-statut"><i></i><span class="js-statut-txt"></span></span></div><table>' + h + '</table><small>' + I.retraits + '</small></div>' +
    '</div>' +
    '<div class="r-pied-trouver"><div><b>Nous trouver</b><br>' + I.adresse + '<br>' + I.tel + '</div><ul class="r-distances">' + I.distances.map(function(d){ return '<li><b>' + d[0] + '</b> ' + d[1] + ' km</li>'; }).join('') + '</ul></div>' +
    '<div class="r-pied-bas"><span>© Scierie Rétif · Mentions légales · Confidentialité · Garantie légale · Tarifs de ' + I.tarifsDate + '</span><b>Maquette de proposition, ce n’est pas le site officiel.</b></div>' +
    '</div></div>';
}
function couches(){
  var d = document.createElement('div');
  d.innerHTML = '<div class="r-ombre" data-fermer></div>' +
    '<aside class="r-drawer" aria-label="Ma liste"><div class="r-dr-h"><h2>Ma liste</h2><button class="r-dr-x" data-fermer aria-label="Fermer">×</button></div>' +
      '<div class="r-dr-corps"><ul class="r-dr-items js-items"></ul><p class="r-dr-vide js-vide-liste">Votre liste est vide. Choisissez une pièce, puis « Ajouter à ma liste ».</p>' +
      '<div class="r-dr-somme js-somme"><div><span>Total estimé TTC</span><b><span class="js-total">0,00</span> €</b></div><div class="r-dr-meta js-meta"></div><div class="r-dr-rem js-rem"></div></div>' +
      '<div class="r-dr-opts js-opts"><button class="on" data-opt>Je viens chercher</button><span class="o">ou</span><button data-opt>Transporteur</button></div>' +
      '<button class="r-dr-envoi js-envoi" data-envoyer>Envoyer ma demande de devis</button><p class="r-dr-note">Pas de paiement en ligne : la scierie vous envoie votre devis par mail, avec le poids et le volume.</p></div>' +
      '<div class="r-dr-ok"><svg viewBox="0 0 90 90"><circle cx="45" cy="45" r="38"/><path d="M28 46l12 12 22-25"/></svg><h3>C’est envoyé !</h3><p>La scierie prépare votre devis et vous l’envoie par mail.</p><button class="r-btn r-btn--noir" data-termine style="margin-top:16px">Fermer</button></div></aside>' +
    '<div class="r-rp" role="dialog" aria-label="Recherche"><div class="r-wrap"><div class="r-rp-ligne"><label class="r-rp-champ"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg><input class="js-rp" type="search" placeholder="Rechercher un produit : bastaing, lame, vis…" aria-label="Rechercher un produit"></label><button class="r-btn r-btn--sauge" data-fermer>Fermer</button></div><div class="r-rp-res js-rp-res"></div><p class="r-rp-vide js-rp-vide" hidden>Aucun produit ne correspond. Appelez-nous au ' + I.tel + ' : on a sûrement ce qu’il vous faut.</p></div></div>' +
    '<div class="r-menu-mobile"><div class="entete"><a class="r-logo" href="index.html"><span class="r-logo-rond"><img src="img/logo-rond.png" alt=""></span><span><b>Scierie Rétif</b></span></a><button class="r-icone-btn" data-fermer aria-label="Fermer">✕</button></div><nav>' +
      NAV.map(function(n){ return '<a href="' + n[2] + '">' + n[1] + '</a>'; }).join('') + '</nav><div class="cats">' + D.CATEGORIES.map(function(c){ return '<a href="produits.html#' + c.k + '">' + c.t + '</a>'; }).join('') + '</div></div>' +
    '<div class="r-toast"></div>';
  while (d.firstChild) document.body.appendChild(d.firstChild);
}

/* ---------- Statut ouvert / fermé ---------- */
function majStatut(){ var s = statut(); $$('.js-statut').forEach(function(e){ e.classList.toggle('ferme', !s[0]); }); $$('.js-statut-txt').forEach(function(e){ e.textContent = s[1]; }); }

/* ---------- Recherche instantanée ---------- */
var TOUS = [];
D.CATEGORIES.forEach(function(c){ c.produits.forEach(function(p){ TOUS.push({p:p, c:c, txt:norm(p.t + ' ' + p.d + ' ' + c.t)}); }); });
function chercher(q){
  q = norm(q.trim());
  var res = q ? TOUS.filter(function(x){ return x.txt.indexOf(q) > -1; }).slice(0, 8) : TOUS.filter(function(x){ return x.p.prix; }).slice(0, 8);
  $('.js-rp-res').innerHTML = res.map(function(x){
    var cible = x.p.go ? ' href="' + x.p.go + '"' : ' href="produits.html?q=' + encodeURIComponent(x.p.t) + '"';
    return '<a' + cible + '><span class="th">' + vignette(x.p) + '</span><span><b>' + x.p.t + '</b><small>' + x.c.t + (x.p.prix ? ' · ' + x.p.prix : '') + '</small></span></a>';
  }).join('');
  $('.js-rp-vide').hidden = !!res.length;
}
function ouvrirRecherche(o){
  document.body.classList.toggle('r-recherche-ouverte', o);
  if (o){ var i = $('.js-rp'); chercher(i.value); setTimeout(function(){ i.focus(); }, 300); }
}

/* ---------- « Ma liste » (gardée d'une page à l'autre) ---------- */
var CLE = 'retif-liste-v2', liste = [];
try { liste = JSON.parse((LS && LS.getItem(CLE)) || '[]') || []; } catch (e) { liste = []; }
function sauver(){ try { if (LS) LS.setItem(CLE, JSON.stringify(liste)); } catch (e) {} }
function rendreListe(anim){
  var pieces = 0, total = 0, vol = 0;
  liste.forEach(function(it){ pieces += it.q; total += it.q * it.prix; vol += it.q * (it.vol || 0); });
  $$('.js-nb').forEach(function(e){ e.textContent = pieces; });
  compte($('.js-total'), total, anim ? 600 : 0);
  $('.js-meta').textContent = pieces ? (vol ? 'Poids ≈ ' + Math.round(vol * 530) + ' kg · volume ' + fmt(vol).replace(/0$/, '') + ' m³' : '') : '';
  $('.js-rem').textContent = total >= 300 ? 'Prêt de remorque offert (dès 300 €)' : (pieces ? 'Encore ' + fmt(300 - total) + ' € pour la remorque offerte' : '');
  $('.js-items').innerHTML = liste.map(function(it, i){ return '<li><span>' + it.nom + (it.detail ? ' · ' + it.detail : '') + '</span><small>' + it.q + ' × ' + fmt(it.prix) + ' €</small><b>' + fmt(it.q * it.prix) + ' €</b><button data-retirer="' + i + '">Retirer</button></li>'; }).join('');
  var vide = !liste.length;
  $('.js-vide-liste').style.display = vide ? 'block' : 'none';
  [$('.js-somme'), $('.js-opts'), $('.js-envoi')].forEach(function(e){ e.style.display = vide ? 'none' : ''; });
}
function ajouter(it, depuis){
  var ex = null;
  liste.forEach(function(x){ if (x.cle === it.cle) ex = x; });
  if (ex) ex.q += it.q; else liste.push({cle:it.cle, nom:it.nom, detail:it.detail || '', prix:it.prix, q:it.q, vol:it.vol || 0});
  sauver(); rendreListe(true);
  var b = $('.js-liste-btn'); b.classList.remove('r-bump'); void b.offsetWidth; b.classList.add('r-bump');
  if (depuis && !REDUIT){
    var r = depuis.getBoundingClientRect(), f = document.createElement('div');
    f.className = 'r-fly'; f.textContent = '+' + it.q; document.body.appendChild(f);
    f.style.left = (r.left + r.width / 2 - f.offsetWidth / 2) + 'px'; f.style.top = (r.top - 8) + 'px';
    f.animate([{transform:'translateY(0)', opacity:0}, {transform:'translateY(-22px)', opacity:1, offset:.3}, {transform:'translateY(-40px)', opacity:0}], {duration:900, easing:'cubic-bezier(.22,.61,.36,1)'}).finished.then(function(){ f.remove(); });
  }
}
function ouvrirListe(o){ document.body.classList.toggle('r-liste-ouverte', o); if (!o) setTimeout(function(){ document.body.classList.remove('r-envoye'); }, 450); }

/* ---------- Clics communs ---------- */
document.addEventListener('click', function(e){
  var t = e.target.closest('[data-ouvrir-liste],[data-ouvrir-recherche],[data-ouvrir-menu],[data-fermer],[data-envoyer],[data-termine],[data-opt],[data-retirer],[data-toast],[data-aller]');
  if (!t) return;
  if (t.hasAttribute('data-ouvrir-liste')) ouvrirListe(true);
  else if (t.hasAttribute('data-ouvrir-recherche')) ouvrirRecherche(true);
  else if (t.hasAttribute('data-ouvrir-menu')) document.body.classList.add('r-menu-ouvert');
  else if (t.hasAttribute('data-fermer')){ ouvrirListe(false); ouvrirRecherche(false); document.body.classList.remove('r-menu-ouvert'); }
  else if (t.hasAttribute('data-envoyer')) document.body.classList.add('r-envoye');
  else if (t.hasAttribute('data-termine')){ liste = []; sauver(); rendreListe(false); ouvrirListe(false); }
  else if (t.hasAttribute('data-opt')) $$('[data-opt]').forEach(function(b){ b.classList.toggle('on', b === t); });
  else if (t.hasAttribute('data-retirer')){ liste.splice(+t.getAttribute('data-retirer'), 1); sauver(); rendreListe(true); }
  else if (t.hasAttribute('data-toast')){ e.preventDefault(); toast(t.getAttribute('data-toast')); }
  else if (t.hasAttribute('data-aller')) location.href = t.getAttribute('data-aller');
});
document.addEventListener('keydown', function(e){
  if (e.key === 'Escape'){ ouvrirListe(false); ouvrirRecherche(false); document.body.classList.remove('r-menu-ouvert'); }
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('[role="button"]')){ e.preventDefault(); e.target.click(); }
});

/* ---------- Démarrage ---------- */
function demarrer(){
  var he = $('[data-entete]'), pe = $('[data-pied]');
  if (he) he.outerHTML = '<header>' + entete() + '</header>';
  if (pe) pe.outerHTML = '<footer>' + pied() + '</footer>';
  couches();
  $('.js-rp').addEventListener('input', function(){ chercher(this.value); });
  $('.js-rp').addEventListener('keydown', function(e){ if (e.key === 'Enter' && this.value.trim()) location.href = 'produits.html?q=' + encodeURIComponent(this.value.trim()); });
  majStatut(); setInterval(majStatut, 30000);
  rendreListe(false);
  var logo = $('.js-logo'), bl = $('.r-bandeau-logo');
  window.addEventListener('scroll', function(){
    if (REDUIT) return;
    var a = (window.scrollY * 0.3).toFixed(1);
    if (logo) logo.style.transform = 'rotate(' + a + 'deg)';
    if (bl) bl.style.transform = 'rotate(' + a + 'deg)';
  }, {passive:true});
  observer();
}
/* Fait apparaître les éléments .r-reveal au défilement. Une page qui en ajoute plus tard rappelle RetifSite.observer(). */
var io = null;
function observer(){
  var els = $$('.r-reveal:not(.vu)');
  if (!('IntersectionObserver' in window) || REDUIT){ els.forEach(function(e){ e.classList.add('vu'); }); return; }
  if (!io) io = new IntersectionObserver(function(es){ es.forEach(function(en){ if (en.isIntersecting){ en.target.classList.add('vu'); io.unobserve(en.target); } }); }, {threshold:.12});
  els.forEach(function(e){ io.observe(e); });
}

window.RetifSite = {
  donnees:D, infos:I, fmt:fmt, lenNum:lenNum, norm:norm, compte:compte, statut:statut, icone:icone, vignette:vignette, toast:toast,
  carteProduit:carteProduit, MSG_FICHE:MSG_FICHE, observer:function(){ observer(); },
  liste:{ajouter:ajouter, ouvrir:function(){ ouvrirListe(true); }, elements:function(){ return liste.slice(); }},
  reduit:REDUIT
};
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarrer); else demarrer();
})();
