document.addEventListener('DOMContentLoaded', () => {
  const res = document.getElementById('pump-result');
  const calcBtns = [document.getElementById('calc-pump'), document.getElementById('calc-pump-fr')];
  const resetBtns = [document.getElementById('reset-pump'), document.getElementById('reset-pump-fr')];

  const calc = () => {
    const V = +document.getElementById('volume').value; // m3
    const speed = +document.getElementById('speed').value; // m3/h
    const dist = +document.getElementById('distance').value; // m
    const slump = document.getElementById('slump').value;

    if (!(V>0 && speed>0 && dist>=0)) {
      res.innerHTML = '<span data-lang="en" class="is-en">Invalid input</span><span data-lang="fr" class="is-fr">Entrées invalides</span>';
      return;
    }

    let time = V / speed; // hours
    const distFactor = 1 + dist/100; // simple 1% per meter
    time *= distFactor;
    if (slump === 'high') time *= 0.9;
    if (slump === 'low') time *= 1.1;

    const timeMin = time*60;

    const en = `Estimated pumping time: ${time.toFixed(2)} h (${timeMin.toFixed(0)} min)`;
    const fr = `Temps de pompage estimé : ${time.toFixed(2)} h (${timeMin.toFixed(0)} min)`;

    res.innerHTML = `<span data-lang="en" class="is-en">${en}</span><span data-lang="fr" class="is-fr">${fr}</span>`;
  };

  const reset = () => res.innerHTML='';
  calcBtns.forEach(b=>b.addEventListener('click', calc));
  resetBtns.forEach(b=>b.addEventListener('click', reset));
});