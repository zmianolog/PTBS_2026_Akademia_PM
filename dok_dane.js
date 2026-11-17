/* Wspólna warstwa danych dokumentów projektowych i tożsamość użytkownika. */
/* ===== warstwa danych dokumentów =====
   Dwa tryby z tym samym interfejsem (wszystkie operacje są asynchroniczne):
   - Firebase: dokumenty w kolekcji „dokumenty”, historia zmian w podkolekcji „historia” (tylko dopisywanie);
   - podgląd: dane w pamięci tej przeglądarki (localStorage), zmiany z innych kart przeglądarki pojawiają się na bieżąco. */
const PODGLAD = APM.trybPodgladu() || APM.podglad();
const DANE = (() => {
  const nowy = () => ({ pola: {}, kroki: {}, uwagi: {}, edycja: {}, wersja: 0, doAkc: null, akc: null, potw: null });
  const norm = d => Object.assign(nowy(), d || {});
  const kopia = o => JSON.parse(JSON.stringify(o));
  const teraz = () => new Date().toISOString();
  const klE = (pole, kto) => pole + '__' + String(kto).normalize('NFD').replace(/[^A-Za-z0-9]/g, '_');
  if (PODGLAD) {
    const kl = id => 'apm_dok_' + id, kh = id => 'apm_dokh_' + id, sl = {};
    const czyt = id => { try { return norm(JSON.parse(localStorage.getItem(kl(id)))); } catch (e) { return nowy(); } };
    const pisz = (id, d) => { localStorage.setItem(kl(id), JSON.stringify(d)); (sl[id] || []).forEach(cb => cb(czyt(id))); };
    const hist = id => { try { return JSON.parse(localStorage.getItem(kh(id))) || []; } catch (e) { return []; } };
    const dopisz = (id, w) => { const h = hist(id); h.push(w); localStorage.setItem(kh(id), JSON.stringify(h)); };
    window.addEventListener('storage', e => { Object.keys(sl).forEach(id => { if (e.key === kl(id)) sl[id].forEach(cb => cb(czyt(id))); }); });
    return {
      tryb: 'podglad',
      czytaj: async id => czyt(id),
      otworz: (id, cb) => { (sl[id] = sl[id] || []).push(cb); cb(czyt(id)); },
      async zapiszPole(id, pole, wart, bazaW, kto, wymus) {
        const d = czyt(id), stare = d.pola[pole] || { v: null, w: 0 };
        if (!wymus && (stare.w || 0) !== (bazaW || 0)) return { konflikt: stare };
        d.wersja++; d.pola[pole] = { v: wart, w: (stare.w || 0) + 1, kto, kiedy: teraz(), dw: d.wersja };
        dopisz(id, { pole, stara: stare.v ?? null, nowa: wart, kto, kiedy: d.pola[pole].kiedy, wersja: d.wersja });
        pisz(id, d); return { ok: d.pola[pole], D: d };
      },
      async zmien(id, fn) { const d = czyt(id); fn(d); pisz(id, d); return d; },
      async edycja(id, pole, kto, on) { const d = czyt(id), k = klE(pole, kto); if (on) d.edycja[k] = { pole, kto, do: Date.now() + 120000 }; else delete d.edycja[k]; pisz(id, d); },
      hist: async id => hist(id),
      async dopiszHist(id, w) { dopisz(id, Object.assign({ kiedy: teraz() }, w)); }
    };
  }
  let B = null;
  const start = async () => { if (!B) { await APM.init(); B = APM.baza(); } return B; };
  const ref = id => B.fs.doc(B.db, 'dokumenty', id);
  const histRef = id => B.fs.collection(B.db, 'dokumenty', id, 'historia');
  return {
    tryb: 'firebase',
    async czytaj(id) { await start(); const s = await B.fs.getDoc(ref(id)); return norm(s.exists() ? s.data() : null); },
    async otworz(id, cb) { await start(); B.fs.onSnapshot(ref(id), s => cb(norm(s.exists() ? s.data() : null)), e => console.warn('APM: odczyt dokumentu', e)); },
    async zapiszPole(id, pole, wart, bazaW, kto, wymus) {
      await start();
      return B.fs.runTransaction(B.db, async tx => {
        const s = await tx.get(ref(id)), d = norm(s.exists() ? s.data() : null), stare = d.pola[pole] || { v: null, w: 0 };
        if (!wymus && (stare.w || 0) !== (bazaW || 0)) return { konflikt: stare };
        const nw = (d.wersja || 0) + 1, p = { v: wart, w: (stare.w || 0) + 1, kto, kiedy: teraz(), dw: nw };
        if (s.exists()) tx.update(ref(id), { ['pola.' + pole]: p, wersja: nw });
        else { d.pola[pole] = p; d.wersja = nw; tx.set(ref(id), d); }
        tx.set(B.fs.doc(histRef(id)), { pole, stara: stare.v ?? null, nowa: wart, kto, kiedy: p.kiedy, wersja: nw });
        d.pola[pole] = p; d.wersja = nw; return { ok: p, D: d };
      });
    },
    async zmien(id, fn) {
      await start();
      return B.fs.runTransaction(B.db, async tx => {
        const s = await tx.get(ref(id)), d = norm(s.exists() ? s.data() : null), n = kopia(d); fn(n);
        if (!s.exists()) { tx.set(ref(id), n); return n; }
        const zm = {}; Object.keys(n).forEach(k => { if (JSON.stringify(n[k]) !== JSON.stringify(d[k])) zm[k] = n[k]; });
        if (Object.keys(zm).length) tx.update(ref(id), zm); return n;
      });
    },
    async edycja(id, pole, kto, on) {
      await start();
      try { await B.fs.updateDoc(ref(id), { ['edycja.' + klE(pole, kto)]: on ? { pole, kto, do: Date.now() + 120000 } : B.fs.deleteField() }); } catch (e) { /* dokument jeszcze nie istnieje */ }
    },
    async hist(id) { await start(); const s = await B.fs.getDocs(B.fs.query(histRef(id), B.fs.orderBy('kiedy'))); return s.docs.map(x => x.data()); },
    async dopiszHist(id, w) { await start(); await B.fs.addDoc(histRef(id), Object.assign({ kiedy: teraz() }, w)); }
  };
})();

/* ===== tożsamość ===== */
const OSOBY_PODGLADU = Object.entries(PROGRAM.zespoly).flatMap(([z, e]) => e.czlonkowie.map(c => ({ imie: c.imie, rola: 'uczestnik', zespol: z })))
  .concat([{ imie: 'Konrad Gieżek', rola: 'zarzad', zespol: '' }, { imie: 'Marcin Żółtak', rola: 'prowadzacy', zespol: '' }]);
function ja() {
  if (PODGLAD) { const i = +(sessionStorage.getItem('apm_podglad_osoba') || localStorage.getItem('apm_podglad_osoba') || 0), o = OSOBY_PODGLADU[i] || OSOBY_PODGLADU[0]; sessionStorage.setItem('apm_podglad_rola', o.rola); return o; }
  return { imie: localStorage.getItem('apm_imie') || APM.kod(), rola: APM.rola(), zespol: localStorage.getItem('apm_zespol') || '' };
}


/* ===== panel trybu podglądu: wybór osoby ===== */
function panelPodgladu(el, parametry) {
  const JA = ja();
  el.innerHTML = `<div class="podglad"><b>Tryb podglądu</b><span>Dane zapisują się tylko w tej przeglądarce. Otwórz tę stronę w drugiej karcie jako inna osoba, aby sprawdzić wspólną pracę.</span>
    ${APM.kod() === 'DEMO-2026' ? '<span style="margin-left:auto;font-weight:600;color:var(--g)">Kod testowy: wybierz osobę, aby zobaczyć stronę jej oczami</span>' : '<a href="akademia.html?podglad=0" style="margin-left:auto;font-weight:600;color:var(--g)">Wyłącz podgląd</a>'}<label>Osoba: <select id="osobaPodgladu">${OSOBY_PODGLADU.map((o, i) => `<option value="${i}" ${o.imie === JA.imie ? 'selected' : ''}>${o.imie} · ${o.rola === 'zarzad' ? 'Zarząd' : o.rola === 'prowadzacy' ? 'prowadzący' : 'zespół ' + o.zespol}</option>`).join('')}</select></label></div>`;
  el.querySelector('#osobaPodgladu').addEventListener('change', e => { sessionStorage.setItem('apm_podglad_osoba', e.target.value); localStorage.setItem('apm_podglad_osoba', e.target.value); const o = OSOBY_PODGLADU[+e.target.value]; sessionStorage.setItem('apm_podglad_rola', o.rola); location.search = parametry(o); });
}

/* ===== stan dokumentu wspólny dla strony dokumentu i strony projektu ===== */
function pustaWartosc(v) {
  if (v && typeof v === 'object' && !Array.isArray(v)) return !Object.values(v).some(l => Array.isArray(l) && l.some(x => x && String(x.t || '').trim()));
  return v == null || v === '' || (Array.isArray(v) && !v.some(r => Object.entries(r).some(([k, x]) => x !== '' && x != null && !['km', 'sp'].includes(k))));
}
function zmienionePoAkceptacji(D) { if (!D.akc) return []; return Object.entries(D.pola).filter(([k, p]) => (p.dw || 0) > D.akc.wersja).map(([k]) => k); }
function stanDokumentu(D) {
  const zm = zmienionePoAkceptacji(D);
  if (D.akc && D.doAkc && D.doAkc.kiedy > D.akc.kiedy) return ['do', 'Przekazana ponownie do akceptacji'];
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

/* ===== narzędziownik: dostępność i kafelek narzędzia ===== */
function czasTerminu(t) { const m = /^(\d{2})\.(\d{2})\.(\d{2})\s+(\d{1,2}):(\d{2})$/.exec((t || '').trim()); return m ? new Date(2000 + +m[3], m[2] - 1, +m[1], +m[4], +m[5]) : null; }
/* narzędzie jest aktywne od rozpoczęcia spotkania wskazanego w arkuszu programu i tylko wtedy, gdy ma gotowy wzór; narzędzia z D00 są aktywne od razu */
function narzedzieAktywne(t) {
  const od = PROGRAM.toolkit[t].od, d = czasTerminu(TERMINY_WSZYSTKIE[od]);
  return !!DOKUMENTY[t] && ((d && d <= new Date()) || od === 'D00');
}
function kafelNarzedzia(t, url) {
  const n = PROGRAM.toolkit[t], akt = narzedzieAktywne(t), ik = IKONY[n.ik] || IKONY.dokument;
  const tresc = `<span class="nk-ik"><svg class="zi zi-r-${ik.r}" viewBox="0 0 24 24">${ik.s}</svg></span><span class="nk-t"><b>${t} ${n.n}</b><small>${n.o}</small></span>`;
  return akt ? `<a class="nk akt" href="${url}">${tresc}</a>` : `<div class="nk" title="Narzędzie będzie aktywne od spotkania ${n.od}">${tresc}</div>`;
}

/* ===== wyjaśnienie pola: po co, jak ustalić, skąd dane, przykłady, najczęstszy błąd ===== */
function htmlWyjasnienia(w) {
  if (!w) return '';
  const e = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const b = (t, x) => x ? `<div class="wy-b"><b>${t}</b><div>${e(x)}</div></div>` : '';
  let h = b('Po co', w.po) + b('Jak ustalić', w.jak) + b('Z czego składa się dobry opis', w.opis);
  if (w.pytania) h += `<div class="wy-b"><b>Pytania do każdego rodzaju straty</b><ul>${PYTANIA_STRAT.map(p => `<li><b>${e(p[0])}.</b> ${e(p[1])}</li>`).join('')}</ul></div>
    <div class="wy-b"><b>Skąd wziąć dane w PTBS</b><ul>${ZRODLA.map(z => `<li><b>${e(z[0])}:</b> ${e(z[1])}.</li>`).join('')}</ul></div>
    <div class="wy-b"><b>Gdy danych brakuje</b><ul>${BRAK_DANYCH.map(x => `<li>${e(x)}</li>`).join('')}</ul></div>`;
  else h += b('Skąd dane', w.skad);
  if (w.etapy) h += ETAPY_KARTY.map(x => `<div class="wy-b"><b>${e(x.n)} (${e(x.sp)})</b><div>${e(x.co)}</div><div><b>Kończy się:</b> ${e(x.km)}.</div><div><b>Przykładowe działania:</b> ${x.pr.map(e).join('; ')}.</div></div>`).join('');
  h += b('Przykład 1', w.p1) + b('Przykład 2', w.p2) + b('Najczęstszy błąd', w.blad);
  return h;
}
if (PODGLAD) ja(); /* rola wybranej osoby podglądu decyduje o menu */
