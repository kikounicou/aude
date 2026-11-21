// Outils communs aux schémas SVG : pastille numérotée (pin), cadre SVG avec ses pointes de flèche (wrap), couleurs.
//   pin(n, x, y, tx, ty)  : pastille n en (x, y), reliée par un trait au point visé (tx, ty)
//   wrap(largeur, hauteur, contenu) : le <svg> ; marqueurs disponibles : url(#fl) noir, url(#flb) blanc, url(#flv) violet
export const ENCRE = '#1d1b2f';
export const pin = (n, x, y, tx, ty) =>
  `<line x1="${x}" y1="${y}" x2="${tx}" y2="${ty}" stroke="${ENCRE}" stroke-width="1.5"/><circle cx="${tx}" cy="${ty}" r="3" fill="${ENCRE}"/>` +
  `<circle cx="${x}" cy="${y}" r="13" fill="#ff5a36"/><text x="${x}" y="${y + 5}" text-anchor="middle" font-size="14" font-weight="800" fill="#fff" font-family="sans-serif">${n}</text>`;
export const wrap = (w, h, inner) =>
  `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img"><defs>
    <marker id="fl" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${ENCRE}"/></marker>
    <marker id="flb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#fff"/></marker>
    <marker id="flv" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#5a2a78"/></marker>
  </defs>${inner}</svg>`;
export const TXT = 'font-family="sans-serif" font-weight="700"';

