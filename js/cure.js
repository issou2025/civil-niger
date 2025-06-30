document.addEventListener('DOMContentLoaded', () => {
  const res = document.getElementById('cure-result');
  const calcBtns = [document.getElementById('calc-cure'), document.getElementById('calc-cure-fr')];
  const resetBtns = [document.getElementById('reset-cure'), document.getElementById('reset-cure-fr')];

  const calc = () => {
    const T = +document.getElementById('temp').value;
    const type = document.getElementById('type').value;

    if (!Number.isFinite(T)) {
      res.innerHTML = '<span data-lang="en" class="is-en">Invalid temperature</span><span data-lang="fr" class="is-fr">Température invalide</span>';
      return;
    }

    // Use Arrhenius-like simple approximation: factor = 2^( (20 - T)/10 )
    let days = 28 * Math.pow(2, (20 - T)/10);
    if (type === 'III') days *= 0.7; // rapid hardening

    const en = `Estimated curing time: ${days.toFixed(1)} days`;
    const fr = `Temps de cure estimé : ${days.toFixed(1)} jours`;

    res.innerHTML = `<span data-lang="en" class="is-en">${en}</span><span data-lang="fr" class="is-fr">${fr}</span>`;
  };

  const reset = () => res.innerHTML='';
  calcBtns.forEach(b=>b.addEventListener('click', calc));
  resetBtns.forEach(b=>b.addEventListener('click', reset));
}); 