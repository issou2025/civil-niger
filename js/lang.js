// Language toggle utility
(function() {
  const LANG_KEY = 'rcv_lang';
  const enBtn = document.querySelector('[data-switch="en"]');
  const frBtn = document.querySelector('[data-switch="fr"]');
  const setLang = (lang) => {
    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem(LANG_KEY, lang);
    // Toggle visibility
    document.querySelectorAll('[data-lang]')?.forEach(el => {
      el.classList.remove('is-en', 'is-fr');
      el.classList.add(`is-${lang}`);
    });
  };

  const preferred = localStorage.getItem(LANG_KEY) || 'en';
  setLang(preferred);

  enBtn && enBtn.addEventListener('click', () => setLang('en'));
  frBtn && frBtn.addEventListener('click', () => setLang('fr'));
})(); 