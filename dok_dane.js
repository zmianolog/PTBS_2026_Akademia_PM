/* Wspólna warstwa danych dokumentów projektowych i tożsamość użytkownika. */
/* ===== warstwa danych dokumentu =====
   Tryb podglądu: dane w pamięci przeglądarki (localStorage); zmiany z innej karty przeglądarki pojawiają się na bieżąco.
   Ten sam interfejs zostanie podłączony do Firestore. */
const DANE = (() => {
  const kl = id => 'apm_dok_' + id, kh = id => 'apm_dokh_' + id;
  const nowy = () => ({ pola: {}, kroki: {}, uwagi: {}, edycja: {}, wersja: 0, doAkc: null, akc: null, potw: null });
  const czytaj = id => { try { return Object.assign(nowy(), JSON.parse(localStorage.getItem(kl(id))) || {}); } catch (e) { return nowy(); } };
  const pisz = (id, d) => localStorage.setItem(kl(id), JSON.stringify(d));
  const hist = id => { try { return JSON.parse(localStorage.getItem(kh(id))) || []; } catch (e) { return []; } };
  function zapiszPole(id, pole, wart, bazaW, ja, wymus) {
    const d = czytaj(id), stare = d.pola[pole] || { v: null, w: 0 };
    if (!wymus && (stare.w || 0) !== (bazaW || 0)) return { konflikt: stare };
    d.wersja++; d.pola[pole] = { v: wart, w: (stare.w || 0) + 1, kto: ja, kiedy: new Date().toISOString(), dw: d.wersja };
    pisz(id, d);
    const h = hist(id); h.push({ pole, stara: stare.v, nowa: wart, kto: ja, kiedy: d.pola[pole].kiedy, wersja: d.wersja });
    localStorage.setItem(kh(id), JSON.stringify(h));
    return { ok: d.pola[pole] };
  }
  function zmien(id, fn) { const d = czytaj(id); fn(d); pisz(id, d); return d; }
  function sluchaj(id, cb) { window.addEventListener('storage', e => { if (e.key === kl(id)) cb(czytaj(id)); }); }
  return { czytaj, zapiszPole, zmien, hist, sluchaj };
})();

/* ===== tożsamość ===== */
const OSOBY_PODGLADU = Object.entries(PROGRAM.zespoly).flatMap(([z, e]) => e.czlonkowie.map(c => ({ imie: c.imie, rola: 'uczestnik', zespol: z })))
  .concat([{ imie: 'Konrad Gieżek', rola: 'zarzad', zespol: '' }, { imie: 'Marcin Żółtak', rola: 'prowadzacy', zespol: '' }]);
const PODGLAD = APM.trybPodgladu() || new URLSearchParams(location.search).get('podglad') === '1';
function ja() {
  if (PODGLAD) { const i = +(sessionStorage.getItem('apm_podglad_osoba') || 0); return OSOBY_PODGLADU[i] || OSOBY_PODGLADU[0]; }
  return { imie: localStorage.getItem('apm_imie') || APM.kod(), rola: APM.rola(), zespol: localStorage.getItem('apm_zespol') || '' };
}


/* ===== panel trybu podglądu: wybór osoby ===== */
function panelPodgladu(el, parametry) {
  const JA = ja();
  el.innerHTML = `<div class="podglad"><b>Tryb podglądu</b><span>Dane zapisują się tylko w tej przeglądarce. Otwórz tę stronę w drugiej karcie jako inna osoba, aby sprawdzić wspólną pracę.</span>
    <label>Osoba: <select id="osobaPodgladu">${OSOBY_PODGLADU.map((o, i) => `<option value="${i}" ${o.imie === JA.imie ? 'selected' : ''}>${o.imie} · ${o.rola === 'zarzad' ? 'Zarząd' : o.rola === 'prowadzacy' ? 'prowadzący' : 'zespół ' + o.zespol}</option>`).join('')}</select></label></div>`;
  el.querySelector('#osobaPodgladu').addEventListener('change', e => { sessionStorage.setItem('apm_podglad_osoba', e.target.value); const o = OSOBY_PODGLADU[+e.target.value]; location.search = parametry(o); });
}

/* ===== stan dokumentu wspólny dla strony dokumentu i strony projektu ===== */
function pustaWartosc(v) { return v == null || v === '' || (Array.isArray(v) && !v.some(r => Object.entries(r).some(([k, x]) => x !== '' && x != null && !['km', 'sp'].includes(k)))); }
function zmienionePoAkceptacji(D) { if (!D.akc) return []; return Object.entries(D.pola).filter(([k, p]) => (p.dw || 0) > D.akc.wersja).map(([k]) => k); }
function stanDokumentu(D) {
  const zm = zmienionePoAkceptacji(D);
  if (D.akc && D.akc.decyzja !== 'do poprawy' && zm.length) return ['zm', 'Zmieniona po akceptacji'];
  if (D.potw) return ['akc', 'Wartość potwierdzona po diagnozie'];
  if (D.akc) return [D.akc.decyzja === 'do poprawy' ? 'zm' : 'akc', D.akc.decyzja === 'do poprawy' ? 'Do poprawy' : 'Zaakceptowana przez sponsora'];
  if (D.doAkc) return ['do', 'Przekazana do akceptacji'];
  return ['', D.wersja ? 'Robocza' : 'Nierozpoczęta'];
}
/* liczba wypełnionych sekcji dokumentu */
function postepDokumentu(def, D) {
  const wart = id => D.pola[id] ? D.pola[id].v : '';
  const sek = def.sekcje.filter(s => !s.akceptacja);
  const pelna = s => s.pola.filter(p => p.typ !== 'wyliczenie' && !p.dom).every(p => (s.kroki && D.kroki[p.id] === 'pom') || !pustaWartosc(wart(p.id)));
  return [sek.filter(pelna).length, sek.length];
}
