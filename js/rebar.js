document.addEventListener('DOMContentLoaded', () => {
  const res = document.getElementById('anchor-result');
  const calcBtns = [document.getElementById('calc-anchor'), document.getElementById('calc-anchor-fr')];
  const resetBtns = [document.getElementById('reset-anchor'), document.getElementById('reset-anchor-fr')];

  const calc = () => {
    const diam = +document.getElementById('diam').value; // mm
    const concrete = +document.getElementById('class').value; // MPa
    const pos = document.getElementById('pos').value;

    if (!(diam>0 && concrete>0)) {
      res.innerHTML = '<span data-lang="en" class="is-en">Enter valid inputs.</span><span data-lang="fr" class="is-fr">Entrées non valides.</span>';
      return;
    }

    let Lb = 40 * diam; // basic assumption
    if (pos === 'top') Lb *= 1.3; // 30% increase

    const en = `Required anchorage length Lb ≈ ${Lb.toFixed(0)} mm`;
    const fr = `Longueur d'ancrage requise Lb ≈ ${Lb.toFixed(0)} mm`;

    res.innerHTML = `<span data-lang="en" class="is-en">${en}</span><span data-lang="fr" class="is-fr">${fr}</span>`;
  };

  const reset = () => res.innerHTML = '';

  calcBtns.forEach(b => b.addEventListener('click', calc));
  resetBtns.forEach(b => b.addEventListener('click', reset));
});
