document.addEventListener('DOMContentLoaded', () => {
  const res = document.getElementById('cont-result');
  const calcBtns = [document.getElementById('calc-cont'), document.getElementById('calc-cont-fr')];
  const resetBtns = [document.getElementById('reset-cont'), document.getElementById('reset-cont-fr')];

  const calc = () => {
    const spans = +document.getElementById('spans').value;
    const L = +document.getElementById('length').value;
    const w = +document.getElementById('load').value;
    const I = +document.getElementById('inertia').value;

    if (!(spans>=2 && spans<=5 && L>0 && w>=0 && I>0)) {
      res.innerHTML = '<span data-lang="en" class="is-en">Invalid input</span><span data-lang="fr" class="is-fr">Entrées invalides</span>';
      return;
    }

    // Simplified moment distribution for equal spans
    const M_fix = w * L * L / 12; // fixed end moment
    let M_mid = -w * L * L / 8; // midspan moment for single span
    
    // Approximate support moments based on spans
    let M_supp;
    switch(spans) {
      case 2:
        M_supp = -M_fix * 0.75;
        break;
      case 3:
        M_supp = -M_fix * 0.85;
        break;
      default:
        M_supp = -M_fix * 0.9; // 4+ spans
    }

    // Max reactions
    const R_end = w * L / 2 + Math.abs(M_supp) / L;
    const R_int = w * L - R_end;

    const en = `Support moment: ${M_supp.toFixed(1)} kN·m<br>
                Midspan moment: ${M_mid.toFixed(1)} kN·m<br>
                End reaction: ${R_end.toFixed(1)} kN<br>
                Interior reaction: ${R_int.toFixed(1)} kN`;
    const fr = `Moment aux appuis : ${M_supp.toFixed(1)} kN·m<br>
                Moment en travée : ${M_mid.toFixed(1)} kN·m<br>
                Réaction d'extrémité : ${R_end.toFixed(1)} kN<br>
                Réaction intermédiaire : ${R_int.toFixed(1)} kN`;

    res.innerHTML = `<span data-lang="en" class="is-en">${en}</span><span data-lang="fr" class="is-fr">${fr}</span>`;
  };

  const reset = () => res.innerHTML = '';
  calcBtns.forEach(b => b.addEventListener('click', calc));
  resetBtns.forEach(b => b.addEventListener('click', reset));
}); 