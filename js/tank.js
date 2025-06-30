document.addEventListener('DOMContentLoaded', () => {
  const res = document.getElementById('tank-result');
  const calcBtns = [document.getElementById('calc-tank'), document.getElementById('calc-tank-fr')];
  const resetBtns = [document.getElementById('reset-tank'), document.getElementById('reset-tank-fr')];

  const calc = () => {
    const workers = +document.getElementById('workers').value;
    const duration = +document.getElementById('duration').value;
    const daily = +document.getElementById('daily').value;

    if (!(workers>0 && duration>0 && daily>0)) {
      res.innerHTML = '<span data-lang="en" class="is-en">Invalid input.</span><span data-lang="fr" class="is-fr">Entrées invalides.</span>';
      return;
    }

    const volume = workers * duration * daily; // liters
    const volumeM3 = volume / 1000;

    const en = `Required tank volume: ${volumeM3.toFixed(2)} m³ (${volume.toFixed(0)} L)`;
    const fr = `Volume du réservoir requis : ${volumeM3.toFixed(2)} m³ (${volume.toFixed(0)} L)`;
    res.innerHTML = `<span data-lang="en" class="is-en">${en}</span><span data-lang="fr" class="is-fr">${fr}</span>`;
  };

  const reset = () => res.innerHTML = '';
  calcBtns.forEach(b=>b.addEventListener('click', calc));
  resetBtns.forEach(b=>b.addEventListener('click', reset));
}); 