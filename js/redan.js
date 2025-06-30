document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('redan-form');
  const resultBox = document.getElementById('result');
  const calcBtns = [document.getElementById('calc-btn'), document.getElementById('calc-btn-fr')];
  const resetBtns = [document.getElementById('reset-btn'), document.getElementById('reset-btn-fr')];

  const calc = () => {
    const steps = +document.getElementById('steps').value;
    const stepH = +document.getElementById('stepHeight').value;
    const load = +document.getElementById('load').value;
    const cap = +document.getElementById('capacity').value;

    if (![steps, stepH, load, cap].every(v => v > 0)) {
      resultBox.innerHTML = '<span data-lang="en" class="is-en">Please enter valid positive numbers.</span><span data-lang="fr" class="is-fr">Veuillez saisir des nombres positifs valides.</span>';
      return;
    }

    const area = load / cap; // m²
    const stepArea = area / steps;
    const stepWidth = Math.sqrt(stepArea); // assuming square step, in m

    const en = `<strong>Total footing area:</strong> ${area.toFixed(2)} m²<br>
                <strong>Area per step:</strong> ${stepArea.toFixed(2)} m²<br>
                <strong>Approx. step width:</strong> ${(stepWidth*1000).toFixed(0)} mm`;
    const fr = `<strong>Surface totale de la semelle:</strong> ${area.toFixed(2)} m²<br>
                <strong>Surface par redan:</strong> ${stepArea.toFixed(2)} m²<br>
                <strong>Largeur approximative du redan:</strong> ${(stepWidth*1000).toFixed(0)} mm`;

    resultBox.innerHTML = `<span data-lang="en" class="is-en">${en}</span><span data-lang="fr" class="is-fr">${fr}</span>`;
  };

  const reset = () => {
    form.reset();
    resultBox.innerHTML = '';
  };

  calcBtns.forEach(btn => btn.addEventListener('click', calc));
  resetBtns.forEach(btn => btn.addEventListener('click', reset));
}); 