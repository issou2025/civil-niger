document.addEventListener('DOMContentLoaded', () => {
  const res = document.getElementById('stair-result');
  const calcBtns = [document.getElementById('calc-stair'), document.getElementById('calc-stair-fr')];
  const resetBtns = [document.getElementById('reset-stair'), document.getElementById('reset-stair-fr')];

  const calc = () => {
    const width = +document.getElementById('widthS').value; // m
    const rise = +document.getElementById('rise').value / 1000; // m
    const run = +document.getElementById('run').value / 1000; // m
    const steps = +document.getElementById('stepsN').value;

    if (!(width>0 && rise>0 && run>0 && steps>0)) {
      res.innerHTML = '<span data-lang="en" class="is-en">Invalid inputs</span><span data-lang="fr" class="is-fr">Entrées invalides</span>';
      return;
    }

    const singleStepLen = Math.sqrt(rise*rise + run*run); // m
    const slopeLen = singleStepLen * steps; // m
    const thickness = 0.15; // m assumed slab thickness
    const concVol = width * slopeLen * thickness; // m3
    const steelRatio = 120; // kg per m3
    const steelWeight = concVol * steelRatio; // kg

    const en = `Approx. concrete volume: ${concVol.toFixed(2)} m³<br>Estimated steel weight: ${steelWeight.toFixed(1)} kg`;
    const fr = `Volume de béton approximatif : ${concVol.toFixed(2)} m³<br>Poids d'acier estimé : ${steelWeight.toFixed(1)} kg`;

    res.innerHTML = `<span data-lang="en" class="is-en">${en}</span><span data-lang="fr" class="is-fr">${fr}</span>`;
  };

  calcBtns.forEach(b=>b.addEventListener('click', calc));
  resetBtns.forEach(b=>b.addEventListener('click', () => res.innerHTML=''));
}); 