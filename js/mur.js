document.addEventListener('DOMContentLoaded', () => {
  const res = document.getElementById('wall-result');
  const calcBtns = [document.getElementById('calc-wall'), document.getElementById('calc-wall-fr')];
  const resetBtns = [document.getElementById('reset-wall'), document.getElementById('reset-wall-fr')];

  const calc = () => {
    const H = +document.getElementById('height').value; // m
    const gamma = +document.getElementById('soil').value; // kN/m³
    const phi = +document.getElementById('phi').value * Math.PI/180; // rad
    const q = +document.getElementById('surcharge').value; // kN/m²
    const fck = +document.getElementById('concrete').value; // MPa
    const fyk = +document.getElementById('steel').value; // MPa

    if (!(H>0 && gamma>=16 && phi>=0.35 && phi<=0.79 && q>=0 && fck>=20 && fyk>=400)) {
      res.innerHTML = '<span data-lang="en" class="is-en">Invalid input</span><span data-lang="fr" class="is-fr">Entrées invalides</span>';
      return;
    }

    // Rankine active earth pressure coefficient
    const Ka = Math.tan(Math.PI/4 - phi/2) ** 2;
    
    // Pressure at base (including surcharge)
    const p = gamma * H * Ka + q * Ka;
    
    // Total force and its point of application
    const Pa = 0.5 * gamma * H * H * Ka + q * H * Ka;
    const y = H * (gamma * H/3 + q/2) / (gamma * H/2 + q);
    
    // Preliminary wall dimensions
    const t = Math.max(0.3, H/12); // stem thickness
    const B = Math.max(0.4*H, H/3); // base width
    
    // Stem moment at base
    const M = Pa * y;
    
    // Required reinforcement (simplified)
    const d = t - 0.07; // effective depth
    const fcd = 0.85 * fck / 1.5;
    const fyd = fyk / 1.15;
    const z = 0.9 * d;
    const As = M * 1000 / (z * fyd); // mm²/m

    const en = `Earth pressure:<br>
                Ka = ${Ka.toFixed(3)}<br>
                Base pressure = ${p.toFixed(1)} kPa<br>
                Total force = ${Pa.toFixed(1)} kN/m<br>
                Preliminary dimensions:<br>
                Base width ≥ ${B.toFixed(2)} m<br>
                Stem thickness ≥ ${t.toFixed(2)} m<br>
                Required steel: ${As.toFixed(0)} mm²/m`;
    const fr = `Poussée des terres :<br>
                Ka = ${Ka.toFixed(3)}<br>
                Pression à la base = ${p.toFixed(1)} kPa<br>
                Force totale = ${Pa.toFixed(1)} kN/m<br>
                Dimensions préliminaires :<br>
                Largeur base ≥ ${B.toFixed(2)} m<br>
                Épaisseur voile ≥ ${t.toFixed(2)} m<br>
                Acier requis : ${As.toFixed(0)} mm²/m`;

    res.innerHTML = `<span data-lang="en" class="is-en">${en}</span><span data-lang="fr" class="is-fr">${fr}</span>`;
  };

  const reset = () => res.innerHTML = '';
  calcBtns.forEach(b => b.addEventListener('click', calc));
  resetBtns.forEach(b => b.addEventListener('click', reset));
}); 