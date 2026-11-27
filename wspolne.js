/* ===== Akademia Zarządzania Projektami PTBS — elementy wspólne wszystkich stron ===== */

/* KONFIGURACJA BAZY: projekt Firebase „apmptbs” (Firestore europe-central2).
   Wartość null przełącza stronę w tryb podglądu (kod DEMO-2026, zapis w przeglądarce). */
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDBcaUQnHhZjSTbSX7s9edw7IFNkI3gDoE",
  authDomain: "apmptbs.firebaseapp.com",
  projectId: "apmptbs",
  storageBucket: "apmptbs.firebasestorage.app",
  messagingSenderId: "239089861415",
  appId: "1:239089861415:web:3ba42fa352854067d95f02"
};

/* MENU: jedna lista dla wszystkich stron. Nowa strona = nowa pozycja na tej liście.
   Pozycja z polem role jest widoczna tylko dla kodów o tej roli (np. zarzad). */
const MENU = [
  { plik: 'akademia.html', nazwa: 'O Akademii' },
  { plik: 'samoocena.html', nazwa: 'Samoocena kompetencji' },
  { plik: 'programy.html', nazwa: 'Programy szkoleniowe' },
  { plik: 'projekt.html', nazwa: 'Narzędziownik', nazwaR: { zarzad: 'Projekty', prowadzacy: 'Projekty' } },
  { plik: 'konsultacje.html', nazwa: 'Konsultacje', role: ['uczestnik', 'prowadzacy', 'test'] },
  { plik: 'wyniki.html', nazwa: 'Wyniki grupy', role: ['zarzad'] }
];

/* KONSULTACJE: stałe okno w tygodniu (dzień: 1 = poniedziałek … 5 = piątek), sloty po 30 minut.
   Strona pokazuje sloty z najbliższych dwóch tygodni. „bez” = dni bez konsultacji w formacie RRRR-MM-DD.
   „teams” = stały link do spotkania w Teams, widoczny dla zespołu przy jego zapisie. „pula” = godziny konsultacji w bieżącej części. */
const KONSULTACJE = { dzien: 5, sloty: ['12:00', '12:30', '13:00'], minut: 30, tygodni: 2, bez: [], teams: '', pula: 8 };

/* TERMINY: wpisz datę i godzinę rozpoczęcia spotkania w formacie DD.MM.RR GG:MM, np. D01:'12.01.27 09:00'. Puste = na kafelku widać wzór DD.MM.RR / GG:MM. */
const TERMINY = { D00:'18.11.26 10:30', D01:'26.11.26 09:30', D02:'01.12.26 09:00', D03:'08.12.26 09:00',
  D04:'15.12.26 09:00', D05:'12.01.27 09:00', D06:'19.01.27 09:00', D07:'26.01.27 09:00', D08:'02.02.27 09:00',
  D09:'09.02.27 09:00', D10:'02.03.27 09:00', D11:'16.03.27 09:00', D12:'23.03.27 09:00', D13:'30.03.27 09:00' };
/* Widoczne są tylko terminy spotkań, które już się odbyły, oraz trzech najbliższych spotkań. Pozostałe terminy są ukryte do czasu, aż staną się jednymi z trzech najbliższych. */
const TERMINY_WSZYSTKIE = Object.assign({}, TERMINY);
(() => {
  const czas=t=>{const m=/^(\d{2})\.(\d{2})\.(\d{2})\s+(\d{1,2}):(\d{2})$/.exec((t||'').trim()); return m?new Date(2000+ +m[3],m[2]-1,+m[1],+m[4],+m[5]):null;};
  const teraz=new Date(); let przyszle=0;
  Object.keys(TERMINY).sort().forEach(k=>{ const d=czas(TERMINY[k]); if(!d||d<teraz) return; przyszle++; if(przyszle>3) TERMINY[k]=''; });
})();

const IKONY = {"start": {"r": "drgaj", "s": "<path d=\"M5 21V3\"/><path class=\"a\" d=\"M5 4h11l-2.5 3.5L16 11H5\"/>"}, "kamien-milowy": {"r": "skok", "s": "<path d=\"M2 19h20M12 15v4\"/><path class=\"a\" d=\"M12 6l4.5 4.5L12 15l-4.5-4.5z\"/>"}, "odpowiedzialnosc": {"r": "skok", "s": "<path d=\"M2 15h4l5 2.5h4.5a1.5 1.5 0 0 0 0-3H12M6 20.5l3-1.5h7l5.5-4a1.5 1.5 0 0 0-2-2.2L16 15\"/><rect class=\"a\" x=\"9.5\" y=\"3\" width=\"6\" height=\"6\" rx=\"1\"/>"}, "wskaznik": {"r": "wahadlo", "s": "<path d=\"M3 17a9 9 0 0 1 18 0M12 8v1.5M6.5 10.5l1 1M17.5 10.5l-1 1\"/><circle class=\"f\" cx=\"12\" cy=\"17\" r=\"1.3\"/><path class=\"a ov\" style=\"transform-origin:12px 17px\" d=\"M12 17l4-5\"/>"}, "wdrozenie": {"r": "skok", "s": "<path d=\"M4 13v6a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-6\"/><path class=\"a\" d=\"M12 3v10M8.5 9.5L12 13l3.5-3.5\"/>"}, "zatwierdzenie": {"r": "rys", "s": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path class=\"a\" pathLength=\"1\" d=\"M8 12.5l2.8 2.8L16 9.5\"/>"}, "wspolpraca": {"r": "puls", "s": "<rect x=\"2\" y=\"9\" width=\"11\" height=\"6\" rx=\"3\"/><rect class=\"a\" x=\"11\" y=\"9\" width=\"11\" height=\"6\" rx=\"3\"/>"}, "zaufanie": {"r": "rys", "s": "<path d=\"M12 3l8 3v6c0 5-3.5 8-8 9.5C7.5 20 4 17 4 12V6z\"/><path class=\"a\" pathLength=\"1\" d=\"M8.5 12l2.5 2.5 4.5-4.5\"/>"}, "motywacja": {"r": "drgaj", "s": "<path d=\"M12 22a7 7 0 0 0 7-7c0-4.5-3-7-4.5-11-2.5 2-3 4.5-3 6-1-1-2-2-2.2-4C7 8.5 5 11.5 5 15a7 7 0 0 0 7 7z\"/><path class=\"a\" d=\"M12 19a2.5 2.5 0 0 0 2.5-2.5c0-1.5-1-2.3-1.5-3.5-.8.8-1 1.5-1 2-.6-.5-1-1-1-2-1 1-1.5 2-1.5 3.5A2.5 2.5 0 0 0 12 19z\"/>"}, "kompromis": {"r": "drgaj", "s": "<path d=\"M12 3v18M7 21h10M4 7h16\"/><path class=\"a\" d=\"M4 7l-2.5 6a2.5 2.5 0 0 0 5 0zM20 7l-2.5 6a2.5 2.5 0 0 0 5 0z\"/>"}, "interesariusze": {"r": "puls", "s": "<circle class=\"a\" cx=\"12\" cy=\"12\" r=\"3\"/><circle cx=\"12\" cy=\"3.5\" r=\"1.6\"/><circle cx=\"20.5\" cy=\"12\" r=\"1.6\"/><circle cx=\"12\" cy=\"20.5\" r=\"1.6\"/><circle cx=\"3.5\" cy=\"12\" r=\"1.6\"/><path d=\"M12 5.1V9M18.9 12H15M12 18.9V15M5.1 12H9\"/>"}, "opor": {"r": "przesun", "s": "<path d=\"M17 5v14M20.5 8v8\"/><path class=\"a\" d=\"M3 12h10M10 9l3 3-3 3\"/>"}, "cel": {"r": "puls", "s": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><circle cx=\"12\" cy=\"12\" r=\"5\"/><circle class=\"af\" cx=\"12\" cy=\"12\" r=\"1.8\"/>"}, "wartosc": {"r": "puls", "s": "<path d=\"M6.5 3h11L22 9 12 21 2 9zM2 9h20\"/><path class=\"a\" d=\"M8.5 9L12 21l3.5-12M9 3l3 6 3-6\"/>"}, "zespol": {"r": "skok", "s": "<circle class=\"a\" cx=\"12\" cy=\"7.5\" r=\"2.8\"/><path d=\"M7.2 19.5c0-3.3 2.2-5.5 4.8-5.5s4.8 2.2 4.8 5.5\"/><circle cx=\"5\" cy=\"9.5\" r=\"2.2\"/><circle cx=\"19\" cy=\"9.5\" r=\"2.2\"/><path d=\"M1.5 18.5c0-2.8 1.5-4.5 3.5-4.5M22.5 18.5c0-2.8-1.5-4.5-3.5-4.5\"/>"}, "standard": {"r": "puls", "s": "<path d=\"M6 3h8l5 5v13H6zM14 3v5h5\"/><circle class=\"a\" cx=\"12\" cy=\"13.5\" r=\"2.5\"/><path class=\"a\" d=\"M10.5 16L10 19.5l2-1 2 1-.5-3.5\"/>"}, "pomiar": {"r": "rys", "s": "<rect x=\"2\" y=\"8\" width=\"20\" height=\"8\" rx=\"1.5\"/><path class=\"a\" pathLength=\"1\" d=\"M6 8v3M10 8v4M14 8v3M18 8v4\"/>"}, "szkolenie": {"r": "drgaj", "s": "<path d=\"M2 9l10-5 10 5-10 5zM6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5\"/><path class=\"a\" d=\"M22 9v6\"/><circle class=\"af\" cx=\"22\" cy=\"16.5\" r=\"1\"/>"}, "dalej": {"r": "przesun", "s": "<path d=\"M5 12h14\"/><path class=\"a\" d=\"M13 6l6 6-6 6\"/>"}, "zadanie": {"r": "rys", "s": "<rect x=\"5\" y=\"4\" width=\"14\" height=\"17\" rx=\"2\"/><path d=\"M9 2.5h6v3H9z\"/><path class=\"a\" pathLength=\"1\" d=\"M8.5 12.5l2.5 2.5 4.5-4.5\"/>"}, "dokument": {"r": "rys", "s": "<path d=\"M6 3h8l5 5v13H6zM14 3v5h5\"/><path class=\"a\" pathLength=\"1\" d=\"M9 13h7M9 17h5\"/>"}, "termin": {"r": "rys", "s": "<rect x=\"3\" y=\"5\" width=\"18\" height=\"16\" rx=\"2\"/><path d=\"M3 10h18M8 3v4M16 3v4\"/><path class=\"a\" pathLength=\"1\" d=\"M8.5 15l2.5 2.5 4.5-4.5\"/>"}, "skalowanie": {"r": "puls", "s": "<rect x=\"9\" y=\"9\" width=\"6\" height=\"6\" rx=\"1\"/><path class=\"a\" d=\"M3 8V3h5M21 8V3h-5M3 16v5h5M21 16v5h-5\"/>"}, "ok": {"r": "rys", "s": "<path class=\"a\" pathLength=\"1\" d=\"M4 12.5l5 5L20 6.5\"/>"}, "notatka": {"r": "rys", "s": "<path d=\"M5 3h14v12l-6 6H5zM13 21v-6h6\"/><path class=\"a\" pathLength=\"1\" d=\"M8.5 8h7M8.5 11.5h5\"/>"}, "materialy": {"r": "drgaj", "s": "<path d=\"M4 19V5h4v14zM9 19V5h4v14zM2 20.5h20\"/><path class=\"a\" d=\"M14.5 6.2l3.8-1 3.6 13.6-3.8 1z\"/>"}, "spotkanie": {"r": "skok", "s": "<rect x=\"7\" y=\"8\" width=\"10\" height=\"8\" rx=\"2\"/><circle class=\"a\" cx=\"9.5\" cy=\"4.5\" r=\"1.5\"/><circle class=\"a\" cx=\"14.5\" cy=\"4.5\" r=\"1.5\"/><circle class=\"a\" cx=\"9.5\" cy=\"19.5\" r=\"1.5\"/><circle class=\"a\" cx=\"14.5\" cy=\"19.5\" r=\"1.5\"/><circle class=\"a\" cx=\"3.5\" cy=\"12\" r=\"1.5\"/><circle class=\"a\" cx=\"20.5\" cy=\"12\" r=\"1.5\"/>"}, "delegowanie": {"r": "rys", "s": "<circle cx=\"6\" cy=\"5\" r=\"2.2\"/><path d=\"M2.5 12c0-2.2 1.6-3.8 3.5-3.8s3.5 1.6 3.5 3.8\"/><circle cx=\"18\" cy=\"12.5\" r=\"2.2\"/><path d=\"M14.5 20c0-2.2 1.6-3.8 3.5-3.8s3.5 1.6 3.5 3.8\"/><path class=\"a\" pathLength=\"1\" d=\"M6 14v3h6M10 15l2 2-2 2\"/>"}, "ryzyko": {"r": "miga", "s": "<path d=\"M10.3 3.9L2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z\"/><path class=\"a\" d=\"M12 9v4.5\"/><circle class=\"af\" cx=\"12\" cy=\"17\" r=\"1\"/>"}, "decyzja": {"r": "puls", "s": "<path class=\"a\" d=\"M12 2.5l5 5-5 5-5-5z\"/><path d=\"M12 12.5V15M12 15H6v3M12 15h6v3\"/><circle class=\"f\" cx=\"6\" cy=\"19.5\" r=\"1.3\"/><circle class=\"f\" cx=\"18\" cy=\"19.5\" r=\"1.3\"/>"}, "pilotaz": {"r": "puls", "s": "<rect x=\"3\" y=\"10\" width=\"4\" height=\"4\" rx=\"1\"/><rect x=\"3\" y=\"17\" width=\"4\" height=\"4\" rx=\"1\"/><rect x=\"10\" y=\"3\" width=\"4\" height=\"4\" rx=\"1\"/><rect x=\"10\" y=\"10\" width=\"4\" height=\"4\" rx=\"1\"/><rect x=\"10\" y=\"17\" width=\"4\" height=\"4\" rx=\"1\"/><rect x=\"17\" y=\"3\" width=\"4\" height=\"4\" rx=\"1\"/><rect x=\"17\" y=\"10\" width=\"4\" height=\"4\" rx=\"1\"/><rect x=\"17\" y=\"17\" width=\"4\" height=\"4\" rx=\"1\"/><rect class=\"a\" x=\"3\" y=\"3\" width=\"4\" height=\"4\" rx=\"1\"/>"}, "refleksja": {"r": "rys", "s": "<path d=\"M12 3a7 7 0 0 0-7 7c0 2 .8 3.5 2 4.6V21h7v-3h2a2 2 0 0 0 2-2v-2.5l2-.5-1.8-3.2A7 7 0 0 0 12 3z\"/><path class=\"a\" pathLength=\"1\" d=\"M10.5 7.5a2.5 2.5 0 1 1 0 5\"/>"}, "prezentacja": {"r": "rys", "s": "<rect x=\"3\" y=\"3\" width=\"18\" height=\"12\" rx=\"1.5\"/><path d=\"M12 15v3M8 21l4-3 4 3\"/><path class=\"a\" pathLength=\"1\" d=\"M7 11l3-3 2 2 4-4\"/>"}, "siec-relacji": {"r": "puls", "s": "<circle cx=\"5\" cy=\"5.5\" r=\"2\"/><circle cx=\"19\" cy=\"5\" r=\"2\"/><circle cx=\"5\" cy=\"18.5\" r=\"2\"/><circle cx=\"19\" cy=\"18.5\" r=\"2\"/><circle class=\"a\" cx=\"12\" cy=\"12\" r=\"2.5\"/><path d=\"M6.5 7L10 10.3M17.5 6.5L14 10.2M6.5 17L10 13.7M17.5 17L14 13.8M7 5.4h10\"/>"}, "macierz": {"r": "puls", "s": "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"/><path d=\"M9 3v18M15 3v18M3 9h18M3 15h18\"/><circle class=\"af\" cx=\"12\" cy=\"12\" r=\"1.6\"/>"}, "wykres-slupkowy": {"r": "rosnij", "s": "<path d=\"M3 21h18\"/><rect x=\"5\" y=\"14\" width=\"3\" height=\"7\" rx=\"0.5\"/><rect x=\"10.5\" y=\"10\" width=\"3\" height=\"11\" rx=\"0.5\"/><rect class=\"a\" x=\"16\" y=\"5\" width=\"3\" height=\"16\" rx=\"0.5\"/>"}, "raport": {"r": "rosnij", "s": "<path d=\"M6 3h8l5 5v13H6zM14 3v5h5\"/><path class=\"a\" d=\"M9 18v-3M12 18v-5M15 18v-2\"/>"}, "checklista": {"r": "rys", "s": "<path d=\"M11 6h9M11 12h9M11 18h9\"/><rect x=\"3.5\" y=\"16\" width=\"4\" height=\"4\" rx=\"1\"/><path class=\"a\" pathLength=\"1\" d=\"M3.5 6l1.5 1.5L8 4.5M3.5 12l1.5 1.5L8 10.5\"/>"}};
const KOMPETENCJE = [{"k": "M1", "n": "Inicjuje projekt", "d": "Przed planowaniem uzgadnia ze sponsorem, po co jest projekt, jaki rezultat ma przynieść i w jakich ramach.", "ik": "start", "faza": "Etap 1 · Uruchomienie", "ef": "formułuje cel projektu jako mierzalny rezultat i przygotowuje kartę projektu z ramami, budżetem ramowym i zasadami podejmowania decyzji", "bl": "tworzenie", "wiod": ["D01"], "wsp": []}, {"k": "M2", "n": "Planuje projekt", "d": "Przekłada cel na plan: prace, kolejność, czas, zasoby, koszty i zagrożenia.", "ik": "kamien-milowy", "faza": "Etap 2 · Diagnoza", "ef": "opracowuje plan projektu: podział pracy, harmonogram z kamieniami milowymi, budżet z zakupami, zasoby i rejestr ryzyk", "bl": "tworzenie", "wiod": ["D03"], "wsp": ["D02", "D07"]}, {"k": "M3", "n": "Organizuje realizację", "d": "Ustala, kto wykonuje i kto zatwierdza zadania, przydziela je i ustala stały rytm pracy.", "ik": "odpowiedzialnosc", "faza": "Etapy 1–2", "ef": "przydziela zadania, ustala odpowiedzialności w macierzy i stały rytm pracy zespołu", "bl": "stosowanie", "wiod": ["D02", "D04"], "wsp": []}, {"k": "M4", "n": "Steruje realizacją", "d": "Porównuje plan z wykonaniem, ustala przyczyny odchyleń i wybiera działania naprawcze.", "ik": "wskaznik", "faza": "Etapy 2–4", "ef": "porównuje plan z wykonaniem, rozpoznaje przyczyny odchyleń i dobiera działania naprawcze albo kieruje sprawę do decyzji", "bl": "analiza", "wiod": ["D06", "D07", "D08", "D10"], "wsp": []}, {"k": "M5", "n": "Wdraża rozwiązanie", "d": "Uruchamia rozwiązanie z projektu w codziennej pracy Spółki, najpierw w ograniczonym zakresie.", "ik": "wdrozenie", "faza": "Etapy 4–5", "ef": "przygotowuje i przeprowadza wdrożenie rozwiązania, łącznie z pilotażem, oraz wskazuje osobę odpowiedzialną za rozwiązanie po projekcie", "bl": "stosowanie", "wiod": ["D10", "D11"], "wsp": []}, {"k": "M6", "n": "Zamyka etap i projekt", "d": "Przegląda zakończony etap, odbiera rezultat według kryteriów i przekazuje wnioski Spółce.", "ik": "zatwierdzenie", "faza": "Etap 5 · Wdrożenie", "ef": "ocenia rezultat według kryteriów odbioru i przeprowadza przegląd etapu, z którego wyprowadza wnioski na kolejny etap", "bl": "ocena", "wiod": ["D11", "D12"], "wsp": ["D10"]}, {"k": "S1", "n": "Ustala zasady współpracy i rozlicza ustalenia", "d": "Uzgadnia z osobami z różnych działów, jak zespół pracuje i podejmuje decyzje, i rozlicza zobowiązania.", "ik": "wspolpraca", "faza": "Przez cały projekt", "ef": "uzgadnia z zespołem zasady współpracy, informowania i podejmowania decyzji oraz rozlicza zobowiązania członków zespołu", "bl": "stosowanie", "wiod": ["D02", "D05"], "wsp": ["D04"]}, {"k": "S2", "n": "Buduje relacje i zaufanie w zespole", "d": "Tworzy warunki, w których ludzie mówią o problemach i błędach i pomagają sobie nawzajem.", "ik": "zaufanie", "faza": "Przez cały projekt", "ef": "reaguje na zgłoszone błędy i problemy tak, aby członkowie zespołu nadal je zgłaszali, i organizuje pracę sprzyjającą wzajemnej pomocy", "bl": "stosowanie", "wiod": ["D05"], "wsp": ["D02"]}, {"k": "S3", "n": "Motywuje i podtrzymuje zaangażowanie", "d": "Podtrzymuje zaangażowanie zespołu bez premii, awansu i poleceń służbowych.", "ik": "motywacja", "faza": "Przez cały projekt", "ef": "rozpoznaje przyczyny spadku zaangażowania i dobiera sposób jego podtrzymania", "bl": "analiza", "wiod": ["D05"], "wsp": ["D04"]}, {"k": "S4", "n": "Rozwiązuje konflikty i negocjuje", "d": "Szuka rozwiązania, które uwzględnia interesy stron i służy celowi projektu.", "ik": "kompromis", "faza": "Przez cały projekt", "ef": "prowadzi uzgodnienie, gdy interesy osób lub komórek są sprzeczne, i doprowadza do decyzji", "bl": "stosowanie", "wiod": ["D09"], "wsp": ["D08"]}, {"k": "S5", "n": "Komunikuje się z interesariuszami", "d": "Przekazuje każdej grupie potrzebne informacje, także niekorzystne, bez zwłoki.", "ik": "interesariusze", "faza": "Przez cały projekt", "ef": "przygotowuje raport o stanie projektu dla Zarządu i informację o zmianach dla pracowników", "bl": "tworzenie", "wiod": ["D01", "D09", "D13"], "wsp": ["D03", "D06", "D07", "D08", "D10", "D11"]}, {"k": "S6", "n": "Wprowadza zmianę i pracuje z oporem", "d": "Rozpoznaje, dlaczego ludzie nie chcą zmiany, i dobiera do tego działania.", "ik": "opor", "faza": "Przez cały projekt", "ef": "rozpoznaje przyczyny oporu wobec zmiany wprowadzanej przez projekt i dobiera działania, które go zmniejszają", "bl": "analiza", "wiod": ["D09"], "wsp": []}];

const ETAPY_PROJ = [{"nr": 1, "n": "Uruchomienie", "sp": ["D00", "D01", "D02"], "zakres": "D00–D02"}, {"nr": 2, "n": "Diagnoza", "sp": ["D03", "D04", "D05", "D06"], "zakres": "D03–D06"}, {"nr": 3, "n": "Koncepcja rozwiązania", "sp": ["D07", "D08"], "zakres": "D07–D08"}, {"nr": 4, "n": "Przygotowanie wdrożenia", "sp": ["D09", "D10"], "zakres": "D09–D10"}, {"nr": 5, "n": "Wdrożenie", "sp": ["D11", "D12", "D13"], "zakres": "D11–D13"}, {"nr": 6, "n": "Działanie i korzyści", "sp": [], "zakres": "po Akademii"}];
const APM = (() => {
  const $ = s => document.querySelector(s);
  const ikona = (id, klasaTla) => { const i=IKONY[id]; return `<span class="ikona ${klasaTla||''}"><svg class="zi zi-r-${i.r} zi-m-najazd" viewBox="0 0 24 24">${i.s}</svg></span>`; };
  const znak = () => `<svg class="znak" viewBox="0 0 34 34" aria-hidden="true">${[0,1,2,3,4,5].map(i=>`<rect x="${1+i*5.5}" y="${30-(8+i*4.4)}" width="4" height="${8+i*4.4}" rx="1.2"/>`).join('')}</svg>`;
  function kod(){ try{ return localStorage.getItem('apm_kod'); }catch(e){ return null; } }
  /* wylogowanie: usuwa kod, rolę, podgląd i logowanie do bazy z tej przeglądarki */
  async function wyloguj(){
    const czysc=()=>{ try{ Object.keys(localStorage).filter(k=>k.startsWith('apm_')&&k!=='apm_konsultacje').forEach(k=>localStorage.removeItem(k)); Object.keys(sessionStorage).filter(k=>k.startsWith('apm_')).forEach(k=>sessionStorage.removeItem(k)); }catch(e){} };
    czysc();
    try{ if(FIREBASE_CONFIG){ await init(); if(auth&&au) await au.signOut(auth); } }catch(e){}
    czysc();
    location.href='index.html';
  }
  /* każda strona poza startową wymaga zapisanego kodu */
  function wymagajLogowania(){ if(!kod()){ location.replace('index.html'); return false; } return true; }
  /* tryb podglądu dokumentów: włączany adresem z ?podglad=1, wyłączany adresem z ?podglad=0 */
  /* kod testowy DEMO-2026 zawsze pracuje w trybie podglądu: widzi całą stronę jako dowolna osoba, bez zmian w danych zespołów */
  function podglad(){ try{ if(kod()==='DEMO-2026') return true; const p=new URLSearchParams(location.search).get('podglad'); if(p==='1') localStorage.setItem('apm_podglad','1'); if(p==='0') localStorage.removeItem('apm_podglad'); return localStorage.getItem('apm_podglad')==='1'; }catch(e){ return false; } }
  function naglowek(){
    const biez = location.pathname.split('/').pop() || 'index.html';
    $('#naglowek').outerHTML = `<header class="naglowek"><div class="wewn">
      <a class="marka" href="akademia.html">${znak()}<span>Akademia<br><b>Zarządzania Projektami PTBS</b></span></a>
      <button class="menu-btn" id="menuBtn" aria-expanded="false">Menu</button>
      <nav class="menu" id="menu">${MENU.filter(m=>!m.role||m.role.includes(rola())||(m.podglad&&podglad())).map(m=>`<a href="${m.plik}${m.podglad&&podglad()?'?podglad=1':''}" class="${m.plik===biez?'biezaca':''}">${(m.nazwaR&&m.nazwaR[rola()])||m.nazwa}</a>`).join('')}</nav>
      ${przewodnikBtn()}
    </div></header>`;
    $('#menu').insertAdjacentHTML('beforeend','<button type="button" id="rozwinBtn" aria-pressed="false" title="Rozwija wszystkie pola tekstowe do pełnej długości wpisanej treści">R · Rozwiń pola</button><a href="index.html?wyloguj=1" id="wylogujMenu">Wyloguj</a>');
    $('#wylogujMenu').addEventListener('click',e=>{ e.preventDefault(); wyloguj(); });
    $('#rozwinBtn').addEventListener('click',()=>ustawRozwin(!document.body.classList.contains('rozwin')));
    ustawRozwin((()=>{ try{ return localStorage.getItem('apm_rozwin')==='1'; }catch(e){ return false; } })());
    $('#przewodnikBtn').addEventListener('click',e=>{ e.stopPropagation(); const d=$('#przewodnikPanel'); const otw=d.classList.toggle('akt'); $('#przewodnikBtn').setAttribute('aria-expanded',String(otw)); if(otw) d.innerHTML=przewodnikTresc(); });
    $('#przewodnikPanel').addEventListener('click',e=>{ if(e.target.closest('[data-oprowadz]')){ $('#przewodnikPanel').classList.remove('akt'); $('#przewodnikBtn').setAttribute('aria-expanded','false'); oprowadz(); return; } if(e.target.closest('[data-prz-zamknij]')){ $('#przewodnikPanel').classList.remove('akt'); $('#przewodnikBtn').setAttribute('aria-expanded','false'); } });
    document.addEventListener('click',e=>{ const d=$('#przewodnikPanel'); if(d&&d.classList.contains('akt')&&!e.target.closest('.przewodnik-w')){ d.classList.remove('akt'); $('#przewodnikBtn').setAttribute('aria-expanded','false'); } });
    document.addEventListener('keydown',e=>{ const d=$('#przewodnikPanel'); if(e.key==='Escape'&&d&&d.classList.contains('akt')){ d.classList.remove('akt'); $('#przewodnikBtn').setAttribute('aria-expanded','false'); } });
    (function mrugaj(){ setTimeout(()=>{ const o=document.querySelector('#przewodnikBtn .oczy'); if(o){ o.classList.add('mrug'); setTimeout(()=>o.classList.remove('mrug'),140); } mrugaj(); }, 2200+Math.random()*3800); })();
    $('#menuBtn').addEventListener('click',()=>{ const m=$('#menu'); m.classList.toggle('otwarte'); $('#menuBtn').setAttribute('aria-expanded',m.classList.contains('otwarte')); });
  }
  /* Przycisk R: rozwija wszystkie pola tekstowe do pełnej długości wpisanej treści; stan zapamiętany w przeglądarce */
  let obsRozwin=null;
  const dopasuj=t=>{ t.style.height='auto'; t.style.height=(t.scrollHeight+4)+'px'; };
  function ustawRozwin(on){
    document.body.classList.toggle('rozwin',on);
    try{ localStorage.setItem('apm_rozwin',on?'1':'0'); }catch(e){}
    const b=document.getElementById('rozwinBtn'); if(b){ b.setAttribute('aria-pressed',String(on)); b.textContent=on?'R · Zwiń pola':'R · Rozwiń pola'; b.title=on?'Przywraca zwykłą wysokość pól tekstowych':'Rozwija wszystkie pola tekstowe do pełnej długości wpisanej treści'; }
    document.querySelectorAll('textarea').forEach(t=>{ if(on) dopasuj(t); else t.style.height=''; });
    if(on&&!obsRozwin){
      obsRozwin=new MutationObserver(()=>{ if(document.body.classList.contains('rozwin')) document.querySelectorAll('textarea').forEach(t=>{ if(t.offsetParent!==null&&t.scrollHeight+4>t.offsetHeight) dopasuj(t); }); });
      obsRozwin.observe(document.body,{childList:true,subtree:true});
      document.addEventListener('input',e=>{ if(document.body.classList.contains('rozwin')&&e.target.tagName==='TEXTAREA') dopasuj(e.target); },true);
      document.addEventListener('click',e=>{ if(document.body.classList.contains('rozwin')&&e.target.closest('button')) setTimeout(()=>{ if(document.body.classList.contains('rozwin')) document.querySelectorAll('textarea').forEach(t=>{ if(t.offsetParent!==null) dopasuj(t); }); },0); },true);
    }
  }
  /* Przewodnik po stronie: opis każdej strony; klucz = plik strony, wartość = tekst dla wszystkich albo osobno dla roli (uczestnik, zarzad, prowadzacy) */
  const PRZEWODNIK = {
    'akademia.html': { t:'O Akademii', k:[
      'Ta strona opisuje Akademię: po co powstała, czego uczestnicy nauczą się w programie i jakie rezultaty Akademia ma przynieść Spółce.',
      'Część „Etapy projektu” pokazuje sześć etapów, przez które każdy zespół prowadzi swój projekt.',
      'Opis każdego spotkania szkoleniowego jest w zakładce „Programy szkoleniowe”.',
      'Swój poziom kompetencji na początku Akademii ocenisz w zakładce „Samoocena kompetencji”.'] },
    'samoocena.html': { t:'Samoocena kompetencji', k:[
      'Przy każdej z dwunastu kompetencji wybierasz poziom od 1 do 4, który najlepiej opisuje, jak dziś działasz w projektach.',
      'Przyciskami „Dalej” i „Wstecz” przechodzisz między kompetencjami. Strona zapisuje odpowiedzi na bieżąco.',
      'Po ostatniej kompetencji kliknij „Sprawdź wyniki”. Strona pokaże Twój profil kompetencji na wykresie.',
      'Na końcu Akademii zobaczysz swoją samoocenę z początku programu i porównasz ją ze swoim obecnym działaniem.'] },
    'programy.html': { t:'Programy szkoleniowe', k:[
      'Strona pokazuje czternaście spotkań szkoleniowych Akademii w kolejności, od D00 do D13.',
      'Kliknij spotkanie, aby zobaczyć jego cele, zakres, kompetencje, przebieg i pracę, którą zespół wykona w projekcie.',
      'Przycisk „Otwórz stronę spotkania” prowadzi do materiałów szkoleniowych i zadań z tego spotkania.'] },
    'spotkanie.html': { t:'Strona spotkania', k:[
      'Strona spotkania zawiera dwie części: materiały szkoleniowe i zadania z tego spotkania.',
      'Przycisk „Otwórz” przy materiale otwiera go w nowej karcie przeglądarki.',
      'Dokumenty projektu waszego zespołu są w zakładce „Narzędziownik” w górnym menu.',
      'Przyciski na dole strony przenoszą do poprzedniego i do następnego spotkania.'] },
    'projekt.html': {
      uczestnik:{ t:'Narzędziownik', k:[
        'Narzędziownik zawiera wszystkie dokumenty projektu waszego zespołu, pogrupowane według spotkań.',
        'Granatowy kafelek oznacza narzędzie dostępne do pracy. Szary kafelek oznacza narzędzie, które zostanie udostępnione później.',
        'Kliknij granatowy kafelek, aby otworzyć dokument. Wszyscy członkowie zespołu pracują w tym samym dokumencie, a strona zapisuje zmiany automatycznie.'] },
      zarzad:{ t:'Projekty', k:[
        'Tabela pokazuje dokumenty wszystkich zespołów i status każdego dokumentu.',
        'Przycisk „Pełny dokument (PDF)” pobiera dokument w formie do przeczytania i wydruku.',
        'Gdy zespół przekaże dokument do akceptacji, przycisk „Akceptuję” przy tym dokumencie staje się aktywny. Kliknięcie przycisku zapisuje akceptację.',
        'Uwagi do dokumentu wyślij zespołowi albo prowadzącemu zwykłym mailem.'] },
      prowadzacy:{ t:'Projekty', k:[
        'Tabela pokazuje dokumenty wszystkich zespołów i status każdego dokumentu.',
        'Otwórz dokument, aby dodać uwagi do jego sekcji. Uwagi widzi zespół i sponsor.'] } },
    'konsultacje.html': { t:'Konsultacje', k:[
      'Konsultacje zespołów odbywają się w Teams w piątki, w slotach po 30 minut.',
      'Wpisz temat konsultacji przy wolnym slocie i kliknij „Zapisz zespół”.',
      'Zapis waszego zespołu odwołasz przyciskiem „Odwołaj zapis”.',
      'Przy zapisie waszego zespołu pojawia się przycisk „Dołącz w Teams”.'] },
    'wyniki.html': { t:'Wyniki grupy', k:[
      'Wykres pokazuje średnią samoocenę uczestników Akademii w dwunastu kompetencjach, w skali od 1 do 4.',
      'Kliknij ikonę kompetencji, aby zobaczyć jej opis i rozkład odpowiedzi w grupie.',
      'Strona nie pokazuje odpowiedzi poszczególnych osób.'] },
    'dokument.html': {
      uczestnik:{ t:'Dokument zespołu', k:[
        'Dokument składa się z numerowanych sekcji. Status całego dokumentu i numer jego wersji są w prawym górnym rogu, nad treścią.',
        'Treść wpisujesz bezpośrednio w polach. Strona zapisuje ją automatycznie, a zielony znak „Dane zapisane” potwierdza zapis.',
        'Przycisk „Wyjaśnienie” przy polu pokazuje, po co jest pole, jak je wypełnić, przykłady i typowe błędy.',
        'Przycisk „R · Rozwiń pola” w górnym menu powiększa wszystkie pola tekstowe tak, aby była widoczna cała wpisana treść. Ponowne kliknięcie przywraca zwykłą wysokość pól.',
        'W karcie projektu, w kroku 6 sekcji „Wartość projektu”, wykres pokazuje, w którym miesiącu korzyści z projektu pokryją jego koszt. Suwakami ustawiacie, kiedy zaczynają się korzyści i jak szybko osiągają pełną kwotę.',
        'Gdy dokument jest gotowy, zespół przekazuje go sponsorowi przyciskiem w ostatniej sekcji.'] },
      zarzad:{ t:'Dokument zespołu', k:[
        'Strona pokazuje pełną treść dokumentu zespołu w formie do czytania.',
        'Przycisk „Drukuj lub zapisz PDF” przygotowuje dokument do wydruku albo do zapisania jako plik PDF.',
        'W karcie projektu, w części „Wartość projektu”, wykres pokazuje, w którym miesiącu korzyści z projektu pokryją jego koszt, według założeń zespołu.',
        'Decyzję o dokumencie zapisujesz w części „Decyzja sponsora” na dole strony.'] },
      prowadzacy:{ t:'Dokument zespołu', k:[
        'Strona pokazuje pełną treść dokumentu zespołu.',
        'Przycisk „Widok uczestnika” pokazuje dokument w układzie, który widzi zespół, z danymi z bazy i bez możliwości edycji. Przycisk „Widok dokumentu” przywraca widok do czytania.',
        'Uwagi do sekcji wpisujesz w polu „Nowa uwaga do tej sekcji” i zapisujesz przyciskiem „Dodaj uwagę”.'] } },
    'instrukcja.html': { t:'Instrukcja dokumentu', k:[
      'Instrukcja opisuje każde pole dokumentu: po co jest, jak je wypełnić, przykłady i typowe błędy.',
      'Przycisk „Drukuj lub zapisz PDF” przygotowuje instrukcję do wydruku.'] },
    'prowadzacy.html': { t:'Panel prowadzącego', k:[
      'Panel służy do tworzenia kodów, przypisywania osób do zespołów i przeglądania wyników samooceny.'] }
  };
  function przewodnikTresc(){
    const biez=location.pathname.split('/').pop()||'index.html', w=PRZEWODNIK[biez];
    const r=rola(), o=w&&(w.k?w:(w[r]||w[r==='test'?'uczestnik':'']||w.uczestnik));
    const lista=o?`<ol>${o.k.map(x=>`<li>${x}</li>`).join('')}</ol>`:'<p>Dla tej strony nie ma jeszcze opisu.</p>';
    const kroki=krokiOprowadzania();
    return `<div class="prz-gl"><b>Przewodnik po stronie</b><span>${o?o.t:''}</span></div>${lista}<div class="prz-akcje">${kroki.length?'<button type="button" class="zml-btn" data-oprowadz>Oprowadź mnie</button>':''}<button type="button" class="zml-btn" data-prz-zamknij>Zamknij</button></div>`;
  }
  /* ===== Oprowadzanie po stronie =====
     Klucz = plik strony; wartość = lista kroków (wspólna albo osobno dla roli). Krok: s = selektor CSS (pierwszy widoczny element),
     z = tekst, od którego musi zaczynać się treść elementu (opcjonalnie), t = opis. Kroki z elementami, których na stronie nie ma, są pomijane. */
  const KROK_MENU = [
    { s:'#menu', t:'Górne menu jest takie samo na każdej stronie Akademii. Prowadzi do opisu Akademii, samooceny, programów spotkań, Narzędziownika i konsultacji.' },
    { s:'#menuBtn', t:'Przycisk „Menu” otwiera listę stron Akademii: opis Akademii, samoocenę, programy spotkań, Narzędziownik i konsultacje.' },
    { s:'#rozwinBtn', t:'Przycisk „R · Rozwiń pola” powiększa wszystkie pola tekstowe tak, aby była widoczna cała wpisana treść. Ponowne kliknięcie przywraca zwykłą wysokość pól.' },
    { s:'#przewodnikBtn', t:'Przewodnik po stronie. Kliknięcie otwiera opis bieżącej strony i przycisk „Oprowadź mnie”.' } ];
  const OPROWADZANIE = {
    'akademia.html': [
      { s:'main h1', t:'Tytuł i dwa akapity pod nim opisują, czym jest Akademia i w jaki sposób uczestnicy w niej pracują.' },
      { s:'#efM', t:'Efekty uczenia się w kompetencjach merytorycznych. Każda karta opisuje, co uczestnik potrafi zrobić w projekcie po zakończeniu Akademii.' },
      { s:'#efS', t:'Efekty uczenia się w kompetencjach społecznych: współpraca w zespole, komunikacja z interesariuszami i wprowadzanie zmiany.' },
      { s:'#efR', t:'Efekty realizacyjne, czyli rezultaty, które Akademia ma przynieść Spółce na zakończenie programu.' },
      { s:'#petla', t:'Sposób pracy w Akademii: spotkanie szkoleniowe, praca zespołu nad projektem między spotkaniami i omówienie tej pracy na kolejnym spotkaniu.' },
      { s:'#etapy', t:'Sześć etapów projektu. Przy każdym etapie są spotkania, na których zespoły nad nim pracują.' },
      { s:'#kM', t:'Opisy sześciu kompetencji merytorycznych. Każda kompetencja odpowiada działaniom w kolejnych etapach projektu.' },
      { s:'#kS', t:'Opisy sześciu kompetencji społecznych, z których uczestnik korzysta przez cały czas trwania projektu.' },
      { s:'#grafEtapy', t:'Wykres pokazuje, w których etapach projektu uczestnicy pracują z każdą kompetencją. Ciemne pole oznacza kompetencję wiodącą, złote pole kompetencję wspierającą.' },
      ...KROK_MENU ],
    'samoocena.html': [
      { s:'#wStart .ramka-info', t:'Zasady samooceny: ile trwa, jak wybierać odpowiedzi i do czego służą wyniki.' },
      { s:'#startBtn', t:'Przycisk rozpoczyna samoocenę. Jeśli część odpowiedzi jest już zapisana, przycisk pozwala ją kontynuować.' },
      { s:'#wynikStart', t:'Twój profil kompetencji z samooceny. Kliknięcie ikony pokazuje opis kompetencji i Twoją ocenę.' },
      { s:'#pPasek', t:'Pasek pokazuje, ile kompetencji już oceniłeś, a ile zostało.' },
      { s:'#pytanie', t:'Opis działania w jednej kompetencji i cztery zdania do wyboru. Wybierz zdanie, które najlepiej opisuje Twoje obecne działanie.' },
      { s:'#dalej', t:'Przycisk „Dalej” przechodzi do kolejnej kompetencji, a przycisk „Wstecz” do poprzedniej. Odpowiedzi zapisują się na bieżąco.' } ],
    'programy.html': [
      { s:'#kafle', t:'Lista czternastu spotkań szkoleniowych w kolejności. Kliknięcie spotkania pokazuje jego opis.' },
      { s:'#program .gl', t:'Kod i nazwa wybranego spotkania.' },
      { s:'#program .przyciski', t:'Przycisk „Otwórz stronę spotkania” prowadzi do materiałów szkoleniowych i zadań z tego spotkania.' },
      { s:'#program .meta', t:'Etap projektu, do którego należy spotkanie, oraz jego termin.' },
      { s:'#program .blok', z:'Cele', t:'Cele spotkania: co uczestnik potrafi zrobić po spotkaniu.' },
      { s:'#program .blok', z:'Kompetencje', t:'Kompetencje, z którymi uczestnicy pracują na spotkaniu: wiodące i wspierające.' },
      { s:'#program .blok', z:'Praca w projekcie', t:'Praca, którą zespół wykonuje w swoim projekcie przed spotkaniem i po spotkaniu.' },
      { s:'#program .blok', z:'Wzory', t:'Narzędzia, które zespoły poznają na spotkaniu, i narzędzia, z których dalej korzystają.' } ],
    'spotkanie.html': [
      { s:'main .gl', t:'Kod i nazwa spotkania.' },
      { s:'main .meta', t:'Termin i miejsce spotkania.' },
      { s:'nav.zakladki', t:'Zakładki przełączają widok między materiałami szkoleniowymi a zadaniami ze spotkania.' },
      { s:'#z-materialy', t:'Materiały szkoleniowe. Przycisk „Otwórz” przy materiale otwiera go w nowej karcie przeglądarki.' },
      { s:'.nawig', t:'Przyciski prowadzą do poprzedniego spotkania, do listy wszystkich spotkań i do następnego spotkania.' } ],
    'projekt.html': {
      uczestnik: [
        { s:'#tresc .nk-grupa', t:'Narzędzia są pogrupowane według spotkań, na których zespoły je poznają.' },
        { s:'#tresc .nk.akt', t:'Granatowy kafelek oznacza narzędzie dostępne do pracy. Kliknięcie kafelka otwiera dokument waszego zespołu.' },
        { s:'#tresc .nk:not(.akt)', t:'Szary kafelek oznacza narzędzie, które zostanie udostępnione później.' } ],
      zarzad: [
        { s:'#tresc .tp', t:'Tabela dokumentów wszystkich zespołów. W kolumnach są zespoły, w wierszach dokumenty, a w polach status każdego dokumentu.' },
        { s:'#tresc a[href*="pdf=1"]', t:'Przycisk „Pełny dokument (PDF)” pobiera dokument zespołu w formie do przeczytania i wydruku.' },
        { s:'#tresc [data-akc]', t:'Przycisk „Akceptuję” staje się aktywny, gdy zespół przekaże dokument do akceptacji. Kliknięcie przycisku zapisuje akceptację.' } ] },
    'konsultacje.html': [
      { s:'.kz-zasady', t:'Zasady konsultacji: kiedy się odbywają, kto zapisuje zespół i do kiedy można odwołać zapis.' },
      { s:'.kz-slot.nasz', t:'Konsultacja, na którą zapisał się wasz zespół, z tematem i przyciskiem do odwołania zapisu.' },
      { s:'.kz-slot.wolny', t:'Wolny termin. Wpiszcie temat konsultacji w polu i kliknijcie „Zapisz zespół”.' },
      { s:'#tresc section', z:'Wszystkie zapisy', t:'Lista wszystkich zapisów na konsultacje.' } ],
    'wyniki.html': [
      { s:'main .lead', t:'Opis wykresu: średnia samoocena grupy w dwunastu kompetencjach, w skali od 1 do 4.' },
      { s:'#stanW .ramka-info', t:'Informacja, od ilu zapisanych samoocen strona pokazuje wyniki grupy.' },
      { s:'#wykres', t:'Wykres wyników grupy. Kliknięcie ikony kompetencji pokazuje jej opis i rozkład odpowiedzi.' } ],
    'dokument.html': {
      uczestnik: [
        { s:'#tytul', t:'Nazwa dokumentu i kod zespołu.' },
        { s:'#stanDok', t:'Status dokumentu i numer wersji. Numer rośnie przy każdej zapisanej zmianie.' },
        { s:'main > .przyciski', t:'Przycisk „Instrukcja” otwiera opis wszystkich pól. Przycisk „Drukuj lub zapisz PDF” przygotowuje dokument do wydruku. Przycisk „Rejestr zmian” pokazuje, kto i kiedy zmienił każde pole.' },
        { s:'#tresc .sek .sg', t:'Nagłówek sekcji z jej numerem i nazwą. Dokument składa się z kilku takich sekcji.' },
        { s:'#tresc .wy-btn', t:'Przycisk „Wyjaśnienie” pokazuje, po co jest pole, jak je wypełnić, przykłady i najczęstszy błąd.' },
        { s:'#tresc input.wej, #tresc textarea.wej', t:'Pole do wpisania treści. Strona zapisuje wpis automatycznie, a zielony znak „Dane zapisane” potwierdza zapis.' },
        { s:'#tresc [data-dodaj]', t:'Przycisk „Dodaj wiersz” dodaje nowy wiersz do tabeli. Strzałki przy wierszu zmieniają jego kolejność, a znak × usuwa wiersz.' },
        { s:'#tresc [data-krok]', t:'Krok, który nie dotyczy waszego projektu, pomijacie tym przyciskiem. Kolejny krok pojawia się po wypełnieniu albo pominięciu bieżącego.' },
        { s:'#tresc [data-symbox] .sym', t:'Wykres pokazuje, w którym miesiącu korzyści z projektu pokryją jego koszt. Suwakami ustawiacie, kiedy zaczynają się korzyści, jak szybko osiągają pełną kwotę i jaki okres obejmuje wykres.' },
        { s:'#tresc .uwagi', t:'Uwagi prowadzącego do sekcji. Po uwzględnieniu uwagi kliknijcie „Oznacz jako uwzględnioną”.' },
        { s:'#doAkcBtn', t:'Gdy dokument jest gotowy, zespół przekazuje go sponsorowi do akceptacji tym przyciskiem.' },
        { s:'#rozwinBtn', t:'Przycisk „R · Rozwiń pola” powiększa wszystkie pola tekstowe tak, aby była widoczna cała wpisana treść.' } ],
      zarzad: [
        { s:'#tytul', t:'Nazwa dokumentu i kod zespołu.' },
        { s:'#stanDok', t:'Status dokumentu i numer wersji.' },
        { s:'#drukBtn', t:'Przycisk „Drukuj lub zapisz PDF” przygotowuje dokument do wydruku albo do zapisania jako plik PDF.' },
        { s:'#podgladDok', t:'Pełna treść dokumentu zespołu w formie do czytania.' },
        { s:'#podgladDok .sym', t:'Wykres pokazuje, w którym miesiącu korzyści z projektu pokryją jego koszt, według założeń zespołu opisanych pod wykresem.' },
        { s:'#akcUw', t:'Pole na uwagi do decyzji. Wpisanie uwag nie jest obowiązkowe.' },
        { s:'.akc-dec', t:'Decyzja o dokumencie: „Akceptuję”, „Akceptuję z uwagami” albo „Do poprawy”. Kliknięcie przycisku zapisuje decyzję.' } ],
      prowadzacy: [
        { s:'#stanDok', t:'Status dokumentu i numer wersji.' },
        { s:'#widokBtn', t:'Przycisk przełącza między widokiem dokumentu do czytania a widokiem uczestnika, czyli układem, który widzi zespół. W widoku uczestnika pola są zablokowane, a suwaki wykresu zwrotu działają tylko na Twoim ekranie i niczego nie zapisują.' },
        { s:'#podgladDok', t:'Pełna treść dokumentu zespołu.' },
        { s:'#podgladDok .uwagi, #tresc .uwagi', t:'Uwagi do sekcji: wpisz uwagę w polu i kliknij „Dodaj uwagę”.' } ] },
    'instrukcja.html': [
      { s:'.ins-gl', t:'Najważniejsze informacje o dokumencie: po co jest, kto go wypełnia, kiedy i kto go akceptuje.' },
      { s:'.ins-sek', t:'Opis pól jednej sekcji dokumentu. Przy każdym polu jest wyjaśnienie, sposób wypełnienia i przykłady.' },
      { s:'#drukBtn', t:'Przycisk „Drukuj lub zapisz PDF” przygotowuje instrukcję do wydruku.' } ],
    'prowadzacy.html': [
      { s:'section.sekcja', z:'Kody uczestników', t:'Tworzenie kodów uczestników i pobieranie ich listy w pliku CSV.' },
      { s:'section.sekcja', z:'Zespoły', t:'Przypisanie osób i kodów do zespołów.' },
      { s:'section.sekcja', z:'Samoocena', t:'Wyniki samooceny kompetencji.' } ]
  };
  const widoczny = e => { if(!e) return false; const r=e.getBoundingClientRect(), st=getComputedStyle(e); return r.width>0&&r.height>0&&st.visibility!=='hidden'&&st.display!=='none'; };
  function znajdz(k){ const L=[...document.querySelectorAll(k.s)].filter(widoczny); return k.z?L.find(e=>(e.innerText||'').trim().startsWith(k.z)):L[0]; }
  function krokiOprowadzania(){
    const biez=location.pathname.split('/').pop()||'index.html', w=OPROWADZANIE[biez]; if(!w) return [];
    const r=rola(), L=Array.isArray(w)?w:(w[r]||w[r==='test'?'uczestnik':'']||w.uczestnik||[]);
    const seen=new Set(); return L.map(k=>({k,e:znajdz(k)})).filter(x=>x.e&&!seen.has(x.e)&&seen.add(x.e));
  }
  function oprowadz(){
    const K=krokiOprowadzania(); if(!K.length) return;
    let i=0;
    const w=document.createElement('div'); w.className='opr'; w.innerHTML='<div class="opr-tlo"></div><div class="opr-ramka"></div><div class="opr-okno" role="dialog" aria-live="polite"><div class="opr-licz"></div><div class="opr-t"></div><div class="opr-akcje"><button type="button" class="zml-btn" data-o="w">Wstecz</button><button type="button" class="zml-btn" data-o="d">Dalej</button><button type="button" class="zml-btn" data-o="z">Zakończ</button></div></div>';
    document.body.appendChild(w);
    const ramka=w.querySelector('.opr-ramka'), okno=w.querySelector('.opr-okno');
    const naglH=()=>{ const h=document.querySelector('.naglowek'); return h?h.getBoundingClientRect().bottom:0; };
    const ustaw=()=>{
      const e=K[i].e, r=e.getBoundingClientRect(), vh=innerHeight, vw=innerWidth, p=6, wNagl=!!e.closest('.naglowek');
      const top=Math.max(r.top-p, wNagl?0:naglH()), bot=Math.min(r.bottom+p, vh);
      ramka.style.cssText=`top:${top}px;left:${Math.max(r.left-p,2)}px;width:${Math.min(r.width+2*p,vw-4)}px;height:${Math.max(bot-top,20)}px`;
      if(vw<700){ okno.style.cssText='left:8px;right:8px;bottom:8px;top:auto;width:auto'; return; }
      const ow=Math.min(420,vw-24), oh=okno.offsetHeight||190; let oy=bot+12, ox=Math.min(Math.max(r.left,12),vw-ow-12);
      if(oy+oh>vh-8) oy=top-oh-12;
      if(oy<naglH()+8) { oy=Math.max(naglH()+8, Math.min(vh-oh-12, top+12)); ox=vw-ow-16; }
      oy=Math.max(naglH()+8,Math.min(oy,vh-oh-8));
      okno.style.cssText=`top:${oy}px;left:${ox}px;width:${ow}px`;
    };
    const pokaz=()=>{
      const e=K[i].e;
      w.querySelector('.opr-licz').textContent=`Krok ${i+1} z ${K.length}`;
      w.querySelector('.opr-t').textContent=K[i].k.t;
      w.querySelector('[data-o="w"]').disabled=i===0;
      const ost=i===K.length-1; w.querySelector('[data-o="d"]').classList.toggle('ukryty',ost); w.querySelector('.opr-akcje').style.gridTemplateColumns=ost?'repeat(2,1fr)':'';
      if(!e.closest('.naglowek')){ const r=e.getBoundingClientRect(), nh=naglH(), mobOkno=innerWidth<700?okno.offsetHeight+16:0, wolne=innerHeight-nh-mobOkno;
        e.style.scrollMarginTop=(nh+12)+'px'; e.style.scrollMarginBottom=(mobOkno+12)+'px';
        e.scrollIntoView({block:r.height+24>wolne?'start':'center',behavior:'smooth'}); }
      ustaw(); setTimeout(ustaw,350); setTimeout(ustaw,700);
      w.querySelector(ost?'[data-o="z"]':'[data-o="d"]').focus({preventScroll:true});
    };
    const koniec=()=>{ removeEventListener('scroll',ustaw,true); removeEventListener('resize',ustaw); document.removeEventListener('keydown',kl,true); w.remove(); };
    const kl=e=>{ if(e.key==='Escape'){ e.preventDefault(); koniec(); } else if(e.key==='ArrowRight'){ e.preventDefault(); if(i<K.length-1){i++;pokaz();} else koniec(); } else if(e.key==='ArrowLeft'){ e.preventDefault(); if(i>0){i--;pokaz();} } };
    w.addEventListener('click',e=>{ const b=e.target.closest('[data-o]'); if(!b) return; const o=b.dataset.o; if(o==='z') return koniec(); if(o==='w'&&i>0){i--;pokaz();} if(o==='d'){ if(i<K.length-1){i++;pokaz();} else koniec(); } });
    addEventListener('scroll',ustaw,true); addEventListener('resize',ustaw); document.addEventListener('keydown',kl,true);
    pokaz();
  }
  function przewodnikBtn(){
    const B='fill="#fff"';
    return `<div class="przewodnik-w"><button class="przewodnik" id="przewodnikBtn" aria-expanded="false" aria-controls="przewodnikPanel" aria-label="Przewodnik po stronie" title="Przewodnik po stronie">
      <svg viewBox="58 51 148 148" aria-hidden="true"><circle class="puls" cx="132" cy="125" r="68" fill="none" stroke="#1F4460" stroke-width="4"/>
      <g class="oddech"><circle cx="132" cy="125" r="66" fill="#1F4460"/>
      <g class="oczy" transform="translate(76 92)"><path d="M36 22a6 6 0 1 1-12 0 6 6 0 0 1 12 0ZM88 22a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z" ${B}/></g>
      <g transform="translate(76 80)"><path d="M26.55 6.15c-5.8.27-15.2 4.49-14.96 10.34.01.18.3.27.43.12 2.76-2.96 22.32-5.95 29.2-4.36.64.14 1.12-.48.72-.93-3.43-3.85-10.2-5.43-15.4-5.18ZM86.45 6.15c5.8.27 15.2 4.49 14.96 10.34-.01.18-.3.27-.43.12-2.76-2.96-22.32-5.95-29.2-4.36-.64.14-1.12-.48-.72-.93 3.43-3.85 10.2-5.43 15.4-5.18Z" ${B}/></g>
      <g transform="translate(78 130)"><path d="M40 16c0 5.37 6.16 9 14 9s14-3.63 14-9c0-1.1-.95-2-2-2-1.3 0-1.87.9-2 2-1.24 2.94-4.32 4.72-10 5-5.68-.28-8.76-2.06-10-5-.13-1.1-.7-2-2-2-1.05 0-2 .9-2 2Z" ${B}/></g></g></svg>
    </button><div class="przewodnik-panel" id="przewodnikPanel" role="dialog" aria-label="Przewodnik po stronie"></div></div>`;
  }
  function stopka(){
    $('#stopka').outerHTML = `<footer class="stopka"><div class="wewn"><span>ZMIANOLOGICA · dr Marcin Żółtak</span><button class="link" id="wyloguj">Wyloguj z tego urządzenia</button></div></footer>`;
    $('#wyloguj').addEventListener('click',wyloguj);
  }
  /* ===== baza danych ===== */
  let db=null, fs=null, auth=null, au=null, gotowe=null;
  const PROWADZACY_EMAIL='marcin.zoltak@zmianologi.ca';
  function init(){ return gotowe||(gotowe=(async()=>{
    if(!FIREBASE_CONFIG) return false;
    const app=(await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js')).initializeApp(FIREBASE_CONFIG);
    au=await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');
    fs=await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    db=fs.getFirestore(app); auth=au.getAuth(app);
    const u=await new Promise(r=>{ const off=au.onAuthStateChanged(auth,x=>{ off(); r(x); }); });
    const kk=kod(), naProw=location.pathname.endsWith('prowadzacy.html');
    /* kod wpisany na stronie logowania ma pierwszeństwo przed kontem Google prowadzącego (poza stroną prowadzącego) */
    if(u&&!u.isAnonymous&&u.email===PROWADZACY_EMAIL&&(naProw||!kk||kk==='PROWADZACY')){
      /* prowadzący zalogowany kontem Google na stronie prowadzącego */
      try{ localStorage.setItem('apm_rola','prowadzacy'); localStorage.setItem('apm_imie','Marcin Żółtak'); localStorage.setItem('apm_zespol',''); }catch(e){}
      return true;
    }
    if(u&&!u.isAnonymous) await au.signOut(auth);
    if(!auth.currentUser) await au.signInAnonymously(auth);
    /* powiązanie anonimowego logowania z kodem: reguły bazy sprawdzają na tej podstawie osobę, zespół i rolę */
    const k=kod();
    if(k&&k!=='PROWADZACY'){ try{
      const s=await fs.getDoc(fs.doc(db,'kody',k));
      if(s.exists()&&s.data().aktywny){ const d=s.data();
        localStorage.setItem('apm_rola',d.rola||'uczestnik'); localStorage.setItem('apm_imie',d.imie||''); localStorage.setItem('apm_zespol',d.zespol||'');
        await fs.setDoc(fs.doc(db,'uzytkownicy',auth.currentUser.uid),{kod:k,kiedy:new Date().toISOString()}); }
    }catch(e){ console.warn('APM: powiązanie kodu',e); } }
    return true;
  })()); }
  const baza=()=>({db,fs,auth});
  async function sprawdzKod(k){
    if(!db) return k==='DEMO-2026' ? {aktywny:true,rola:'uczestnik'} : null;
    const s=await fs.getDoc(fs.doc(db,'kody',k)); return s.exists()&&s.data().aktywny ? s.data() : null;
  }
  async function wczytaj(zbior,id){
    if(!db){ try{ return JSON.parse(localStorage.getItem(`apm_${zbior}_${id}`)); }catch(e){ return null; } }
    const s=await fs.getDoc(fs.doc(db,zbior,id)); return s.exists()?s.data():null;
  }
  async function zapisz(zbior,id,dane){
    dane.zmiana=new Date().toISOString();
    if(!db){ try{ localStorage.setItem(`apm_${zbior}_${id}`,JSON.stringify(dane)); }catch(e){} return; }
    await fs.setDoc(fs.doc(db,zbior,id),dane);
  }
  const kiedy = k => (k.wiod.length?'Uczymy się: '+k.wiod.join(', '):'')+(k.wsp.length?(k.wiod.length?' · ':'')+'ćwiczymy także: '+k.wsp.join(', '):'');
  function ustawKod(k,r,d){ try{ localStorage.setItem('apm_kod',k); localStorage.setItem('apm_rola',r||'uczestnik'); localStorage.setItem('apm_imie',(d&&d.imie)||''); localStorage.setItem('apm_zespol',(d&&d.zespol)||''); }catch(e){} }
  function rola(){ try{ const pr = podglad() && sessionStorage.getItem('apm_podglad_rola'); return pr || localStorage.getItem('apm_rola')||'uczestnik'; }catch(e){ return 'uczestnik'; } }
  const grafEtapy = (sel) => {
    const el=typeof sel==='string'?document.querySelector(sel):sel; if(!el) return;
    const E=ETAPY_PROJ.filter(e=>e.sp.length), kom=(k,e,typ)=>k[typ].filter(d=>e.sp.includes(d));
    const wiersz=k=>`<div class="ge-k">${ikona(k.ik,k.k[0]==='S'?'spol':'')}<span><b>${k.k}</b> ${k.n}</span></div>`+E.map(e=>{
      const w=kom(k,e,'wiod'), s=kom(k,e,'wsp');
      return w.length?`<div class="ge-p w" title="wiodąca">${w.concat(s).sort().join(' ')}</div>`:s.length?`<div class="ge-p s" title="wspierająca">${s.join(' ')}</div>`:'<div class="ge-p"></div>';}).join('');
    const gr=(t,lst)=>`<div class="ge-gr">${t}</div>`+lst.map(wiersz).join('');
    el.innerHTML=`<div class="ge-wrap"><div class="ge" style="grid-template-columns:minmax(230px,1.6fr) repeat(${E.length},minmax(96px,1fr))">
      <div class="ge-h ge-h0">Kompetencja</div>${E.map(e=>`<div class="ge-h"><span class="ge-nr">${e.nr}</span>${e.n}<small>${e.zakres}</small></div>`).join('')}
      ${gr('Kompetencje merytoryczne',KOMPETENCJE.filter(k=>k.k[0]==='M'))}${gr('Kompetencje społeczne',KOMPETENCJE.filter(k=>k.k[0]==='S'))}
    </div></div><div class="ge-leg"><span><i class="ge-p w"></i>kompetencja wiodąca w etapie</span><span><i class="ge-p s"></i>kompetencja wspierająca</span><span>W polach: spotkania, na których pracujemy z kompetencją.</span></div>`;
  };
  return { $, baza, podglad, rola, kiedy, grafEtapy, ikona, znak, kod, ustawKod, wyloguj, wymagajLogowania, naglowek, stopka, init, sprawdzKod, wczytaj, zapisz, trybPodgladu:()=>!FIREBASE_CONFIG };
})();
