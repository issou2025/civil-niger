document.addEventListener('DOMContentLoaded', () => {
  const result = document.getElementById('beam-result');
  const calcBtns = [document.getElementById('calc-beam'), document.getElementById('calc-beam-fr')];
  const resetBtns = [document.getElementById('reset-beam'), document.getElementById('reset-beam-fr')];

  const calc = () => {
    const span = +document.getElementById('span').value; // m
    const b = +document.getElementById('width').value / 1000; // convert to m
    const soil = +document.getElementById('soil').value; // kN/m²
    const fck = +document.getElementById('fck').value; // MPa assumed equal to N/mm²

    if (![span, b, soil, fck].every(v => v > 0)) {
      result.innerHTML = '<span data-lang="en" class="is-en">Please complete all fields with positive numbers.</span><span data-lang="fr" class="is-fr">Veuillez remplir tous les champs avec des nombres positifs.</span>';
      return;
    }

    const widthContact = b; // assume beam width distributes load across its width
    const w = soil * widthContact; // kN/m (soil pressure * width in m)
    const M = w * Math.pow(span, 2) / 8; // kN·m

    // Convert units: 1 kN·m = 1e6 N·mm
    const M_Nmm = M * 1e6;
    const Zreq = M_Nmm / (0.6 * fck); // mm³
    const dEst = Math.cbrt(Zreq / (0.4 * (b*1000))); // mm, assuming Z = 0.4 b d²

    const en = `<strong>Max moment M:</strong> ${M.toFixed(2)} kN·m<br>
                <strong>Required section modulus Z:</strong> ${(Zreq/1e6).toFixed(2)} x10<sup>6</sup> mm³<br>
                <strong>Estimated effective depth d:</strong> ${dEst.toFixed(0)} mm`;
    const fr = `<strong>Moment max M :</strong> ${M.toFixed(2)} kN·m<br>
                <strong>Module de section requis Z :</strong> ${(Zreq/1e6).toFixed(2)} x10<sup>6</sup> mm³<br>
                <strong>Profondeur efficace estimée d :</strong> ${dEst.toFixed(0)} mm`;

    result.innerHTML = `<span data-lang="en" class="is-en">${en}</span><span data-lang="fr" class="is-fr">${fr}</span>`;
  };

  const reset = () => (result.innerHTML = '');

  calcBtns.forEach(btn => btn.addEventListener('click', calc));
  resetBtns.forEach(btn => btn.addEventListener('click', reset));
}); 