document.addEventListener('DOMContentLoaded', () => {
  const res = document.getElementById('slab-result');
  const calcBtns = [document.getElementById('calc-slab'), document.getElementById('calc-slab-fr')];
  const resetBtns = [document.getElementById('reset-slab'), document.getElementById('reset-slab-fr')];

  const calc = () => {
    const Lx = +document.getElementById('span').value; // m
    const ratio = +document.getElementById('ratio').value;
    const h = +document.getElementById('thick').value / 1000; // m
    const q = +document.getElementById('load').value; // kN/m²
    const fck = +document.getElementById('concrete').value; // MPa
    const fyk = +document.getElementById('steel').value; // MPa

    if (!(Lx>0 && ratio>=1 && ratio<=2 && h>0 && q>0 && fck>=20 && fyk>=400)) {
      res.innerHTML = '<span data-lang="en" class="is-en">Invalid input</span><span data-lang="fr" class="is-fr">Entrées invalides</span>';
      return;
    }

    const Ly = Lx * ratio;
    const d = h - 0.03; // effective depth (assuming 30mm cover)
    
    // Simplified moment coefficients for fixed edges
    const kx = ratio <= 1.5 ? 0.001 * (48 + 14 * ratio) : 0.069;
    const ky = ratio <= 1.5 ? 0.001 * (48 + 14 / ratio) : 0.069;
    
    // Design moments
    const Mx = kx * q * Lx * Lx;
    const My = ky * q * Lx * Lx;
    
    // Required steel areas (simplified)
    const K = 0.156; // limit for singly reinforced section
    const fcd = 0.85 * fck / 1.5;
    const fyd = fyk / 1.15;
    
    const z = 0.9 * d; // lever arm approximation
    const As_x = Mx * 1000 / (z * fyd); // mm²/m
    const As_y = My * 1000 / (z * fyd); // mm²/m

    const en = `Design moments:<br>
                Mx = ${Mx.toFixed(1)} kN·m/m<br>
                My = ${My.toFixed(1)} kN·m/m<br>
                Required steel:<br>
                As,x = ${As_x.toFixed(0)} mm²/m<br>
                As,y = ${As_y.toFixed(0)} mm²/m`;
    const fr = `Moments de calcul :<br>
                Mx = ${Mx.toFixed(1)} kN·m/m<br>
                My = ${My.toFixed(1)} kN·m/m<br>
                Acier requis :<br>
                As,x = ${As_x.toFixed(0)} mm²/m<br>
                As,y = ${As_y.toFixed(0)} mm²/m`;

    res.innerHTML = `<span data-lang="en" class="is-en">${en}</span><span data-lang="fr" class="is-fr">${fr}</span>`;
  };

  const reset = () => res.innerHTML = '';
  calcBtns.forEach(b => b.addEventListener('click', calc));
  resetBtns.forEach(b => b.addEventListener('click', reset));
}); 