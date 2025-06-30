document.addEventListener('DOMContentLoaded', () => {
  const res = document.getElementById('formwork-result');
  const calcBtns = [document.getElementById('calc-formwork'), document.getElementById('calc-formwork-fr')];
  const resetBtns = [document.getElementById('reset-formwork'), document.getElementById('reset-formwork-fr')];

  const calc = () => {
    const width = +document.getElementById('widthCol').value / 1000; // to m
    const depth = +document.getElementById('depthCol').value / 1000;
    const height = +document.getElementById('heightCol').value; // m
    const qty = +document.getElementById('qty').value;

    if (!(width>0 && depth>0 && height>0 && qty>0)) {
      res.innerHTML = '<span data-lang="en" class="is-en">Invalid input.</span><span data-lang="fr" class="is-fr">Entrées invalides.</span>';
      return;
    }

    const perimeter = 2 * (width + depth); // m
    const area = perimeter * height; // m² per column
    const total = area * qty; // m²

    const en = `Formwork area per column: ${area.toFixed(2)} m²<br>Total area: ${total.toFixed(2)} m²`;
    const fr = `Surface de coffrage par poteau : ${area.toFixed(2)} m²<br>Surface totale : ${total.toFixed(2)} m²`;

    res.innerHTML = `<span data-lang="en" class="is-en">${en}</span><span data-lang="fr" class="is-fr">${fr}</span>`;
  };

  const reset = () => res.innerHTML = '';
  calcBtns.forEach(b=>b.addEventListener('click', calc));
  resetBtns.forEach(b=>b.addEventListener('click', reset));
}); 