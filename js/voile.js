document.addEventListener('DOMContentLoaded', () => {
  const res = document.getElementById('wall-result');
  const calcBtns = [document.getElementById('calc-wall'), document.getElementById('calc-wall-fr')];
  const resetBtns = [document.getElementById('reset-wall'), document.getElementById('reset-wall-fr')];

  const calc = () => {
    const h = +document.getElementById('height').value; // m
    const L = +document.getElementById('length').value; // m
    const t = +document.getElementById('thick').value / 1000; // m
    const F = +document.getElementById('force').value; // kN
    const fck = +document.getElementById('concrete').value; // MPa
    const fyk = +document.getElementById('steel').value; // MPa

    if (!(h>0 && L>0 && t>0 && F>=0 && fck>=20 && fyk>=400)) {
      res.innerHTML = '<span data-lang="en" class="is-en">Invalid input</span><span data-lang="fr" class="is-fr">Entrées invalides</span>';
      return;
    }

    // Basic calculations
    const fcd = 0.85 * fck / 1.5; // design concrete strength
    const fyd = fyk / 1.15; // design steel strength
    
    // Shear stress
    const tau = F / (L * t * 1000); // MPa
    const tau_max = 0.2 * fcd;
    
    // Required reinforcement ratios
    const rho_h = tau / fyd; // horizontal reinforcement ratio
    const rho_v = rho_h / 2; // vertical reinforcement ratio (typically half)
    
    // Minimum areas per meter
    const As_h = rho_h * t * 1000 * 1000; // mm²/m
    const As_v = rho_v * t * 1000 * 1000; // mm²/m
    
    // Check if shear stress is acceptable
    const status = tau <= tau_max;
    const statusMsg = {
      en: status ? "OK" : "Increase wall thickness",
      fr: status ? "OK" : "Augmenter l'épaisseur"
    };

    const en = `Shear stress: ${tau.toFixed(2)} MPa (max ${tau_max.toFixed(2)} MPa)<br>
                Status: <strong>${statusMsg.en}</strong><br>
                Horizontal reinforcement: ${As_h.toFixed(0)} mm²/m<br>
                Vertical reinforcement: ${As_v.toFixed(0)} mm²/m`;
    const fr = `Contrainte cisaillement : ${tau.toFixed(2)} MPa (max ${tau_max.toFixed(2)} MPa)<br>
                État : <strong>${statusMsg.fr}</strong><br>
                Armatures horizontales : ${As_h.toFixed(0)} mm²/m<br>
                Armatures verticales : ${As_v.toFixed(0)} mm²/m`;

    res.innerHTML = `<span data-lang="en" class="is-en">${en}</span><span data-lang="fr" class="is-fr">${fr}</span>`;
  };

  const reset = () => res.innerHTML = '';
  calcBtns.forEach(b => b.addEventListener('click', calc));
  resetBtns.forEach(b => b.addEventListener('click', reset));
}); 