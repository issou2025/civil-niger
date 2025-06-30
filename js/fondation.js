document.addEventListener('DOMContentLoaded', () => {
  const res = document.getElementById('found-result');
  const calcBtns = [document.getElementById('calc-found'), document.getElementById('calc-found-fr')];
  const resetBtns = [document.getElementById('reset-found'), document.getElementById('reset-found-fr')];

  const calc = () => {
    const N = +document.getElementById('load').value; // kN
    const M = +document.getElementById('moment').value; // kN·m
    const qs = +document.getElementById('soil').value; // kPa
    const h = +document.getElementById('depth').value; // m
    const fck = +document.getElementById('concrete').value; // MPa
    const fyk = +document.getElementById('steel').value; // MPa

    if (!(N>0 && M>=0 && qs>=50 && h>=0.5 && fck>=20 && fyk>=400)) {
      res.innerHTML = '<span data-lang="en" class="is-en">Invalid input</span><span data-lang="fr" class="is-fr">Entrées invalides</span>';
      return;
    }

    // Preliminary sizing
    const e = M/N; // eccentricity
    const A_req = N * 1.2 / (qs); // required area with safety factor
    const B = Math.sqrt(A_req); // square foundation width
    const L = B + 2*e; // length accounting for eccentricity

    // Pressure distribution
    const qmax = N * (1 + 6*e/L) / (B*L);
    const qmin = N * (1 - 6*e/L) / (B*L);

    // Bending design
    const cantilever = (L - 0.5) / 2; // cantilever length
    const q_design = qmax; // conservative
    const M_design = q_design * cantilever * cantilever / 2;
    
    // Required steel (simplified)
    const d = h - 0.07; // effective depth
    const fcd = 0.85 * fck / 1.5;
    const fyd = fyk / 1.15;
    const z = 0.9 * d;
    const As = M_design * 1000 / (z * fyd); // mm²/m

    const en = `Foundation size:<br>
                Length = ${L.toFixed(2)} m<br>
                Width = ${B.toFixed(2)} m<br>
                Soil pressures:<br>
                qmax = ${qmax.toFixed(0)} kPa<br>
                qmin = ${qmin.toFixed(0)} kPa<br>
                Required steel: ${As.toFixed(0)} mm²/m`;
    const fr = `Dimensions fondation :<br>
                Longueur = ${L.toFixed(2)} m<br>
                Largeur = ${B.toFixed(2)} m<br>
                Pressions sol :<br>
                qmax = ${qmax.toFixed(0)} kPa<br>
                qmin = ${qmin.toFixed(0)} kPa<br>
                Acier requis : ${As.toFixed(0)} mm²/m`;

    res.innerHTML = `<span data-lang="en" class="is-en">${en}</span><span data-lang="fr" class="is-fr">${fr}</span>`;
  };

  const reset = () => res.innerHTML = '';
  calcBtns.forEach(b => b.addEventListener('click', calc));
  resetBtns.forEach(b => b.addEventListener('click', reset));
}); 