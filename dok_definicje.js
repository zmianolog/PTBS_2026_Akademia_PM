/* Definicje dokumentów projektowych Akademii. Każdy dokument to lista sekcji, a sekcja to lista pól.
   Typy pól: tekst, obszar, liczba, wybor, tabela, wyliczenie (tylko do odczytu), kroki (sekcja pokazywana krok po kroku). */
const ZESPOLY = PROGRAM.zespoly;
const SPONSOR = Object.values(PROGRAM.zespoly)[0].sponsor;
const STAWKA_GODZ = 60; /* zł za godzinę pracy, do potwierdzenia przez księgowość */

const DOKUMENTY = {
  T01: {
    nazwa: 'Karta projektu',
    opis: 'Karta opisuje, jaki problem rozwiązuje projekt, ile ten problem kosztuje Spółkę, jaki jest cel i rezultat projektu oraz w jakich ramach zespół działa. Karta jest dokumentem roboczym: zespół uzupełnia ją od spotkania D00, a sponsor akceptuje ją na spotkaniu D02.',
    sekcje: [
      { id: 's1', nr: 1, t: 'Metryczka', pola: [
        { id: 'nazwa_proj', typ: 'tekst', et: 'Nazwa projektu', dom: z => ZESPOLY[z].projekt },
        { id: 'nazwa_zesp', typ: 'tekst', et: 'Nazwa zespołu', pod: 'Nazwa, pod którą zespół występuje w Akademii.' },
        { id: 'sponsor', typ: 'tekst', et: 'Sponsor', dom: () => SPONSOR },
        { id: 'lider', typ: 'tekst', et: 'Lider projektu', dom: z => ZESPOLY[z].lider },
        { id: 'czlonkowie', typ: 'obszar', et: 'Członkowie zespołu', dom: z => ZESPOLY[z].czlonkowie.map(c => c.imie + ' – ' + c.rola).join('\n'), pod: 'Imię, nazwisko i dział każdej osoby. Dopisz także osoby spoza stałego składu, które będą pracować przy projekcie.' }
      ]},
      { id: 's2', nr: 2, t: 'Problem', pola: [
        { id: 'pr_co', typ: 'obszar', et: 'Co dziś nie działa?', pod: 'Opisz sytuację tak, jak wygląda dziś, bez proponowania rozwiązania.' },
        { id: 'pr_kogo', typ: 'obszar', et: 'Kogo problem dotyczy?', pod: 'Działy, stanowiska, najemcy, kontrahenci.' },
        { id: 'pr_skad', typ: 'obszar', et: 'Skąd wiecie, że problem istnieje?', pod: 'Podaj źródło: dane z systemu, rejestr, skargi, obserwacja. Wskaż, kto może te dane udostępnić.' }
      ]},
      { id: 's3', nr: 3, t: 'Wartość projektu', kroki: true,
        wstep: 'Wartość liczycie w ośmiu krokach. Kolejny krok pojawia się, gdy poprzedni jest wypełniony albo pominięty. Krok pomijacie, gdy nie dotyczy waszego projektu. Przy każdej kwocie podajcie źródło. Godzinę pracy wyceniacie stawką ' + STAWKA_GODZ + ' zł.',
        pola: [
        { id: 'w1', typ: 'tabela', et: 'Krok 1. Strata, którą powoduje problem', pod: 'Rodzaje straty: A czas pracy (godziny × ' + STAWKA_GODZ + ' zł), B wydatki zewnętrzne, C utracony przychód, D koszt błędów i poprawek, E ryzyko (prawdopodobieństwo × koszt zdarzenia). Kwota w skali roku.',
          kol: [ { id: 'rodz', t: 'Rodzaj', typ: 'wybor', op: ['A czas pracy', 'B wydatki zewnętrzne', 'C utracony przychód', 'D błędy i poprawki', 'E ryzyko'], s: 1.2 },
                 { id: 'opis', t: 'Opis i sposób wyliczenia', typ: 'obszar', s: 2.4 },
                 { id: 'kw', t: 'Kwota rocznie (zł)', typ: 'liczba', s: 1 },
                 { id: 'zr', t: 'Źródło danych', typ: 'tekst', s: 1.3 },
                 { id: 'pew', t: 'Pewność', typ: 'wybor', op: ['niska', 'średnia', 'wysoka'], s: .9 } ], suma: 'kw' },
        { id: 'w2', typ: 'obszar', et: 'Krok 2. Potrzeba', pod: 'Czego Spółka potrzebuje, żeby strata zniknęła albo się zmniejszyła? Opiszcie potrzebę, a nie gotowe rozwiązanie.' },
        { id: 'w3', typ: 'tabela', et: 'Krok 3. Korzyści po wdrożeniu', pod: 'O ile projekt zmniejszy stratę z kroku 1. Oszczędność twarda zmniejsza wydatki albo zwiększa przychód. Oszczędność miękka uwalnia czas pracy, który Spółka przeznaczy na inne zadania.',
          kol: [ { id: 'kor', t: 'Korzyść', typ: 'obszar', s: 2 },
                 { id: 'rodz', t: 'Rodzaj', typ: 'wybor', op: ['twarda', 'miękka'], s: .9 },
                 { id: 'kw', t: 'Kwota rocznie (zł)', typ: 'liczba', s: 1 },
                 { id: 'jak', t: 'Jak wyliczono', typ: 'obszar', s: 1.8 },
                 { id: 'zr', t: 'Źródło danych', typ: 'tekst', s: 1.2 } ], suma: 'kw', sumaWg: 'rodz' },
        { id: 'w4', typ: 'tabela', et: 'Krok 4. Korzyści bez kwoty', pod: 'Korzyści, których nie da się wiarygodnie wyrazić w złotych. Podajcie miarę niefinansową albo wycenę ryzyka (prawdopodobieństwo × koszt zdarzenia).',
          kol: [ { id: 'kor', t: 'Korzyść', typ: 'obszar', s: 2 }, { id: 'mia', t: 'Miara albo wycena ryzyka', typ: 'obszar', s: 2 }, { id: 'zr', t: 'Źródło danych', typ: 'tekst', s: 1.2 } ] },
        { id: 'w5', typ: 'tabela', et: 'Krok 5. Ramowy budżet projektu', pod: 'Kwota, jaką sponsor dopuszcza na projekt, zanim powstanie budżet szczegółowy na D03. Uwzględnijcie czas pracy zespołu (godziny × ' + STAWKA_GODZ + ' zł) i zakupy.',
          kol: [ { id: 'poz', t: 'Pozycja', typ: 'obszar', s: 2.4 }, { id: 'kw', t: 'Kwota (zł)', typ: 'liczba', s: 1 }, { id: 'zr', t: 'Źródło albo sposób wyliczenia', typ: 'obszar', s: 2 } ], suma: 'kw' },
        { id: 'w6', typ: 'wyliczenie', et: 'Krok 6. Korzyść netto w pierwszym roku', pod: 'Strona wylicza ją z kroków 3 i 5.' },
        { id: 'w7', typ: 'wybor', et: 'Krok 7. Pewność szacunku', op: ['niska', 'średnia', 'wysoka'], pod: 'Jak bardzo ufacie kwotom z kroków 1–5?', dod: { id: 'w7u', typ: 'obszar', et: 'Uzasadnienie' } },
        { id: 'w8', typ: 'obszar', et: 'Krok 8. Dane do zebrania w diagnozie', pod: 'Jakich danych brakuje, żeby potwierdzić kwoty? Kto je ma? Sponsor potwierdzi wartość projektu po diagnozie (KM1, D06).' }
      ]},
      { id: 's4', nr: 4, t: 'Cel projektu', pola: [
        { id: 'cel', typ: 'obszar', et: 'Cel w jednym zdaniu', pod: 'Przykład: „Skrócić czas obsługi zamówienia z 12 do 5 dni do końca czerwca 2027 r.”.' },
        { id: 'cel_m', typ: 'tekst', et: 'Miernik' }, { id: 'cel_o', typ: 'tekst', et: 'Wartość obecna' },
        { id: 'cel_d', typ: 'tekst', et: 'Wartość docelowa' }, { id: 'cel_t', typ: 'tekst', et: 'Termin osiągnięcia' }
      ]},
      { id: 's5', nr: 5, t: 'Rezultaty i zakres', pola: [
        { id: 'rez_p', typ: 'obszar', et: 'Co powstanie w projekcie?', pod: 'Produkt, który wytworzy zespół: procedura, narzędzie, zmieniony obieg dokumentów.' },
        { id: 'rez_e', typ: 'obszar', et: 'Co zmieni się w pracy Spółki?', pod: 'Efekt, z którego biorą się korzyści.' },
        { id: 'zak_t', typ: 'obszar', et: 'Projekt obejmuje', pod: 'Procesy, działy, lokalizacje.' },
        { id: 'zak_n', typ: 'obszar', et: 'Projekt nie obejmuje', pod: 'Co świadomie zostaje poza projektem.' }
      ]},
      { id: 's6', nr: 6, t: 'Kryteria sukcesu', pola: [
        { id: 'kr_r', typ: 'obszar', et: 'Kryteria rezultatu', pod: 'Po czym sponsor pozna, że rozwiązanie działa i ludzie z niego korzystają.' },
        { id: 'kr_k', typ: 'obszar', et: 'Kryteria korzyści', pod: 'O ile ma się zmniejszyć strata z sekcji 3 i kiedy to zmierzycie.' }
      ]},
      { id: 's7', nr: 7, t: 'Ramowe kamienie milowe', pola: [
        { id: 'km', typ: 'tabela', et: 'Kamienie milowe rozwiązania', pod: 'Terminy wynikają z programu Akademii. Oceńcie, czy wasz projekt je osiągnie.', stale: true,
          kol: [ { id: 'km', t: 'Kamień milowy', typ: 'staly', s: 2 }, { id: 'sp', t: 'Spotkanie', typ: 'staly', s: .8 },
                 { id: 'oc', t: 'Czy projekt go osiągnie?', typ: 'wybor', op: ['tak', 'zagrożony', 'nie'], s: 1.1 }, { id: 'uw', t: 'Uwagi', typ: 'obszar', s: 2 } ],
          wiersze: [ { km: 'KM1 · Diagnoza stanu obecnego gotowa', sp: 'D06' }, { km: 'KM2 · Koncepcja rozwiązania zatwierdzona', sp: 'D08' },
                     { km: 'KM3 · Rozwiązanie gotowe do pilotażu', sp: 'D10' }, { km: 'KM4 · Pilotaż uruchomiony', sp: 'po D10' },
                     { km: 'Przekazanie rozwiązania właścicielowi', sp: 'D13' } ] }
      ]},
      { id: 's8', nr: 8, t: 'Kluczowi interesariusze', pola: [
        { id: 'int', typ: 'obszar', et: 'Najważniejsze osoby i działy', pod: 'Krótka lista. Pełny opis interesów, wpływu i sposobu zaangażowania zespół prowadzi w mapie interesariuszy (T02).' }
      ]},
      { id: 's9', nr: 9, t: 'Główne ryzyka', pola: [
        { id: 'ryz', typ: 'tabela', et: 'Najwyżej trzy ryzyka, które mogą zatrzymać projekt', max: 3, pod: 'Uwzględnijcie ograniczenia prawne i organizacyjne, na przykład ochronę danych osobowych, zasady korzystania z narzędzi AI, procedury zamówień, dostępność ludzi.',
          kol: [ { id: 'r', t: 'Ryzyko', typ: 'obszar', s: 2 }, { id: 'sk', t: 'Skutek dla projektu', typ: 'obszar', s: 2 }, { id: 'rk', t: 'Co zrobi zespół', typ: 'obszar', s: 2 } ] }
      ]},
      { id: 's10', nr: 10, t: 'Zakończenie i właściciel rozwiązania', pola: [
        { id: 'zak_k', typ: 'obszar', et: 'Kiedy projekt się kończy?', pod: 'Na przykład: rozwiązanie działa, użytkownicy z niego korzystają, właściciel przejął je razem z planem pomiaru korzyści.' },
        { id: 'zak_w', typ: 'tekst', et: 'Właściciel rozwiązania po Akademii', pod: 'Kto w Spółce przejmie rozwiązanie i będzie mierzył korzyści.' }
      ]},
      { id: 's11', nr: 11, t: 'Akceptacja sponsora', akceptacja: true }
    ]
  }
};
