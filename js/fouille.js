document.addEventListener('DOMContentLoaded', () => {
  const res = document.getElementById('dig-result');
  const calcBtns = [document.getElementById('calc-dig'), document.getElementById('calc-dig-fr')];
  const resetBtns = [document.getElementById('reset-dig'), document.getElementById('reset-dig-fr')];

  const calc = () => {
    const L = +document.getElementById('length').value;
    const D = +document.getElementById('depth').value;
    const top = +document.getElementById('top').value;
    const bot = +document.getElementById('bottom').value;

    if (!(L>0 && D>0 && top>0 && bot>0)) {
      res.innerHTML = '<span data-lang="en" class="is-en">Invalid input</span><span data-lang="fr" class="is-fr">Entrées invalides</span>';
      return;
    }

    const area = (top + bot)/2 * D; // m2 cross-section
    const vol = area * L; // m3

    const en = `Excavation volume: ${vol.toFixed(2)} m³`;
    const fr = `Volume de fouille : ${vol.toFixed(2)} m³`;

    res.innerHTML = `<span data-lang="en" class="is-en">${en}</span><span data-lang="fr" class="is-fr">${fr}</span>`;
  };
  const reset = () => res.innerHTML='';
  calcBtns.forEach(b=>b.addEventListener('click', calc));
  resetBtns.forEach(b=>b.addEventListener('click', reset));
}); 