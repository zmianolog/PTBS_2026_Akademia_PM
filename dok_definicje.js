/* Definicje dokumentów projektowych Akademii. Każdy dokument to lista sekcji, a sekcja to lista pól.
   Typy pól: tekst, obszar, liczba, wybor, tabela, etapy (działania pogrupowane według etapów projektu),
   wyliczenie (tylko do odczytu); sekcja z kroki: true pokazuje pola krok po kroku.
   Pole „wyj” to wyjaśnienie: po (po co), jak (jak ustalić), skad (skąd dane), opis (z czego składa się dobry opis),
   p1 i p2 (przykłady), blad (najczęstszy błąd). */
const ZESPOLY = PROGRAM.zespoly;
const SPONSOR = Object.values(PROGRAM.zespoly)[0].sponsor;
const STAWKA_GODZ = 60; /* zł za godzinę pracy, do potwierdzenia przez księgowość */

const ETAPY_KARTY = [
  { id: 'e1', n: 'Uruchomienie', sp: 'D00–D02', km: 'Akceptacja karty projektu przez sponsora (D02)' },
  { id: 'e2', n: 'Diagnoza', sp: 'D03–D06', km: 'KM1 · Diagnoza stanu obecnego gotowa (D06)' },
  { id: 'e3', n: 'Koncepcja rozwiązania', sp: 'D07–D08', km: 'KM2 · Koncepcja rozwiązania zatwierdzona (D08)' },
  { id: 'e4', n: 'Przygotowanie wdrożenia', sp: 'D09–D10', km: 'KM3 · Rozwiązanie gotowe do pilotażu (D10); KM4 · Pilotaż uruchomiony' },
  { id: 'e5', n: 'Wdrożenie', sp: 'D11–D13', km: 'Przekazanie rozwiązania właścicielowi (D13)' },
  { id: 'e6', n: 'Działanie i korzyści', sp: 'po Akademii', km: 'Korzyści potwierdzone pomiarem' }
];

const PYTANIA_STRAT = [
  ['A czas pracy', 'Kto wykonuje czynności związane z problemem? Ile razy w roku i ile czasu zajmuje jeden raz? Chodzi szczególnie o przepisywanie danych, szukanie informacji, dodatkowe uzgodnienia i poprawki. Kwota: godziny w roku × liczba osób × ' + STAWKA_GODZ + ' zł.'],
  ['B wydatki zewnętrzne', 'Za co Spółka płaci z powodu problemu? Na przykład dopłaty za tryb pilny, kary umowne, odsetki, usługi zewnętrzne, nadgodziny. Kwota: suma faktur lub wypłat w ciągu roku.'],
  ['C utracony przychód', 'Jakie pieniądze nie wpływają, choć mogłyby? Na przykład czynsz za lokale, które stoją puste dłużej, niż muszą, nienaliczone opłaty, utracone dofinansowanie. Kwota: liczba przypadków × utracona kwota na jeden przypadek.'],
  ['D błędy i poprawki', 'Ile błędów zdarza się w roku? Ile kosztuje poprawienie jednego, w czasie pracy i w pieniądzach? Nie liczcie tu czasu, który już ujęliście w rodzaju A.'],
  ['E ryzyko', 'Co złego może się zdarzyć, na przykład kara, negatywny wynik kontroli, naruszenie ochrony danych? Ile razy zdarzyło się to w ostatnich latach? Ile kosztowałoby jedno takie zdarzenie? Kwota: prawdopodobieństwo w skali roku × koszt zdarzenia.']
];
const ZRODLA = [
  ['P1 Gospodarka środkami trwałymi', 'ewidencja środków trwałych, protokoły inwentaryzacji, różnice inwentaryzacyjne, korekty księgowe przy zamknięciu roku'],
  ['P2 PTBS Asystent', 'rejestr korespondencji w kancelarii (liczba pism w roku), czas obsługi jednego pisma, liczba odpowiedzi po terminie'],
  ['P3 Optymalizacja procesu zamówień', 'rejestr zamówień, faktury za tryb pilny, liczba korekt i unieważnień postępowań'],
  ['Wszystkie projekty', 'system księgowy, rejestr skarg najemców, harmonogramy pracy działów']
];
const BRAK_DANYCH = [
  'Przez tydzień lub dwa zapiszcie w prostej tabeli, ile razy występuje czynność i ile czasu zajmuje.',
  'Zapytajcie osoby, które wykonują pracę, o najmniejszą i największą wartość; do karty wpiszcie wartość środkową.',
  'Przy takiej kwocie zaznaczcie pewność „niska” i dopiszcie ją w kroku 8 jako dane do sprawdzenia w diagnozie.'
];

const DOKUMENTY = {
  T01: {
    nazwa: 'Karta projektu',
    instr: {
      po: 'Karta opisuje, jaki problem rozwiązuje projekt, ile ten problem kosztuje Spółkę, jaki jest cel i rezultat projektu oraz kto przejmie rozwiązanie po zakończeniu projektu. Na podstawie karty sponsor decyduje, czy zespół rozpoczyna diagnozę.',
      kto: 'Wypełnia cały zespół projektowy. Każdy członek zespołu może zmieniać każde pole; strona zapisuje autora i datę każdej zmiany w rejestrze zmian.',
      kiedy: 'Zespół zaczyna kartę po spotkaniu D00 i uzupełnia ją do spotkania D02. Karta jest dokumentem roboczym: do akceptacji można ją zmieniać.',
      akc: 'Sponsor akceptuje kartę na spotkaniu D02. Po diagnozie, na kamieniu milowym KM1 (D06), sponsor potwierdza wartość projektu na podstawie zebranych danych.',
      brak: 'Bez karty zespół i sponsor mogą inaczej rozumieć, po co jest projekt i co ma przynieść; zespół nie ma też podstawy do planu diagnozy.'
    },
    sekcje: [
      { id: 's1', nr: 1, t: 'Metryczka', pola: [
        { id: 'nazwa_proj', typ: 'tekst', et: 'Nazwa projektu', dom: z => ZESPOLY[z].projekt,
          wyj: { po: 'Nazwa pozwala jednoznacznie wskazać projekt w rozmowach, raportach i dokumentach Spółki.', jak: 'Nazwa wpisana z programu Akademii. Zmieńcie ją, jeśli w Spółce projekt funkcjonuje pod inną nazwą.',
            p1: 'Gospodarka środkami trwałymi', p2: 'Optymalizacja procesu zamówień' } },
        { id: 'nazwa_zesp', typ: 'tekst', et: 'Nazwa zespołu',
          wyj: { po: 'Krótka nazwa, pod którą zespół występuje na spotkaniach Akademii i w prezentacji dla Zarządu.', jak: 'Wybierzcie nazwę krótką, łatwą do zapamiętania, związaną z projektem.',
            p1: 'Zespół Ewidencja', p2: 'Szybkie Zamówienia' } },
        { id: 'sponsor', typ: 'tekst', et: 'Sponsor', dom: () => SPONSOR,
          wyj: { po: 'Sponsor podejmuje decyzje, których zespół nie może podjąć sam, zatwierdza kartę i koncepcję oraz zapewnia zasoby.', jak: 'Wpisany z programu Akademii.',
            p1: 'Konrad Gieżek, wiceprezes Zarządu', p2: 'Konrad Gieżek' } },
        { id: 'lider', typ: 'tekst', et: 'Lider projektu', dom: z => ZESPOLY[z].lider,
          wyj: { po: 'Lider odpowiada za prowadzenie projektu, kontakt ze sponsorem i rozliczanie ustaleń w zespole.', jak: 'Wpisany z programu Akademii (kierownik projektu w zespole).',
            p1: 'Hanna Bartkowska', p2: 'Michał Gadziński' } },
        { id: 'czlonkowie', typ: 'obszar', et: 'Członkowie zespołu', dom: z => ZESPOLY[z].czlonkowie.map(c => c.imie + ' – ' + c.rola).join('\n'),
          wyj: { po: 'Lista pokazuje, kto pracuje przy projekcie i w jakiej roli; dzięki niej sponsor wie, kogo projekt angażuje.', jak: 'Wpiszcie stały skład zespołu oraz osoby spoza zespołu, które będą pracować przy projekcie, z działem i rolą.',
            opis: 'Imię i nazwisko, dział, rola w projekcie.',
            p1: 'Marta Gębka – dział administracji – uczestnik procesu', p2: 'Anna Kowalska – dział techniczny – udział w diagnozie (przykład osoby spoza zespołu)' } }
      ]},
      { id: 's2', nr: 2, t: 'Problem', pola: [
        { id: 'pr_co', typ: 'obszar', et: 'Co dziś nie działa?',
          wyj: { po: 'Opis problemu jest punktem wyjścia całej karty: z niego wynika strata, cel i rezultat projektu.', jak: 'Opiszcie sytuację tak, jak wygląda dziś: co się dzieje, jak często i z jakim skutkiem. Nie proponujcie jeszcze rozwiązania.',
            opis: 'Co się dzieje, jak często, jaki jest skutek dla Spółki.',
            p1: 'Zamówienie od zgłoszenia potrzeby do podpisania trwa średnio 12 dni roboczych; dokumenty krążą między działami, a dane są przepisywane ręcznie. Co miesiąc dwa lub trzy zamówienia trzeba robić w trybie pilnym, z dopłatą.',
            p2: 'Ewidencja środków trwałych nie zgadza się ze stanem faktycznym: przy każdej inwentaryzacji księgowość koryguje kilkadziesiąt pozycji, a części środków nie da się odnaleźć.',
            blad: 'Opis rozwiązania zamiast problemu, na przykład „brak systemu elektronicznego obiegu”. To jest jedno z możliwych rozwiązań, a nie opis tego, co dziś nie działa.' } },
        { id: 'pr_kogo', typ: 'obszar', et: 'Kogo problem dotyczy?',
          wyj: { po: 'Wskazuje, czyja praca się zmieni i kogo trzeba zaangażować w diagnozę i wdrożenie.', jak: 'Wymieńcie działy, stanowiska i osoby z zewnątrz (najemców, kontrahentów), których problem dotyczy.',
            p1: 'Działy zgłaszające potrzeby (techniczny, administracji), dział zamówień, księgowość; pośrednio najemcy czekający na remonty.', p2: 'Kancelaria, pracownicy odpowiadający na pisma w działach, najemcy oczekujący na odpowiedź.' } },
        { id: 'pr_skad', typ: 'obszar', et: 'Skąd wiecie, że problem istnieje?',
          wyj: { po: 'Pokazuje, na jakich danych opiera się opis problemu; sponsor ocenia na tej podstawie, czy problem jest dobrze rozpoznany.', jak: 'Podajcie źródło i, jeśli możecie, liczbę. Wskażcie, kto może udostępnić dane.',
            skad: 'Rejestry działów, system księgowy, skargi najemców, obserwacja własnej pracy.',
            p1: 'Rejestr zamówień 2025: 400 zamówień, w tym 25 w trybie pilnym; dane udostępni dział zamówień.', p2: 'Protokół inwentaryzacji 2025: 63 różnice inwentaryzacyjne; dane ma Główna Księgowa.',
            blad: 'Ogólne stwierdzenie bez źródła, na przykład „wszyscy wiedzą, że to trwa za długo”.' } }
      ]},
      { id: 's3', nr: 3, t: 'Wartość projektu', kroki: true,
        wstep: 'Wartość liczycie w ośmiu krokach. Kolejny krok pojawia się, gdy poprzedni jest wypełniony albo pominięty. Krok pomijacie, gdy nie dotyczy waszego projektu. Przy każdej kwocie podajcie źródło. Godzinę pracy wyceniacie stawką ' + STAWKA_GODZ + ' zł.',
        pola: [
        { id: 'w1', typ: 'tabela', et: 'Krok 1. Strata, którą powoduje problem',
          kol: [ { id: 'rodz', t: 'Rodzaj', typ: 'wybor', op: ['A czas pracy', 'B wydatki zewnętrzne', 'C utracony przychód', 'D błędy i poprawki', 'E ryzyko'], s: 1.2 },
                 { id: 'opis', t: 'Opis i sposób wyliczenia', typ: 'obszar', s: 2.4 },
                 { id: 'kw', t: 'Kwota rocznie (zł)', typ: 'liczba', s: 1 },
                 { id: 'zr', t: 'Źródło danych', typ: 'tekst', s: 1.3 },
                 { id: 'pew', t: 'Pewność', typ: 'wybor', op: ['niska', 'średnia', 'wysoka'], s: .9 } ], suma: 'kw', sumaEt: 'Strata razem',
          wyj: { po: 'Strata pokazuje, ile problem kosztuje Spółkę w ciągu roku. Od niej zależy, ile może przynieść projekt i ile warto na niego wydać.',
            jak: 'Dla każdego rodzaju straty, który występuje w waszym projekcie, dodajcie jeden wiersz. W opisie zapiszcie rachunek, tak aby inna osoba mogła go sprawdzić. Kwotę podajcie w skali roku.',
            pytania: true, skad: 'Zobaczcie listę źródeł danych w PTBS poniżej.',
            p1: 'A czas pracy · Dodatkowe uzgodnienia i przepisywanie danych: 400 zamówień × 1,5 h × 60 zł · 36 000 zł · rejestr zamówień 2025 i pomiar 10 zamówień · średnia',
            p2: 'B wydatki zewnętrzne · Zamówienia w trybie pilnym z dopłatą: 25 × 800 zł · 20 000 zł · faktury 2025 · wysoka',
            blad: 'Liczenie tej samej straty dwa razy, na przykład czasu poprawek w rodzaju A i w rodzaju D.' } },
        { id: 'w2', typ: 'obszar', et: 'Krok 2. Potrzeba',
          wyj: { po: 'Potrzeba mówi, czego Spółka potrzebuje, żeby strata zniknęła albo się zmniejszyła. Zostawia miejsce na wybór rozwiązania w etapie koncepcji.', jak: 'Opiszcie, jaki stan chcecie osiągnąć, bez wskazywania konkretnego narzędzia.',
            p1: 'Jeden obieg zamówienia z jasnymi etapami, wzorami dokumentów i terminami, bez ręcznego przepisywania danych.', p2: 'Aktualna ewidencja, w której każdy środek trwały ma przypisaną lokalizację i osobę odpowiedzialną.',
            blad: 'Wpisanie gotowego rozwiązania, na przykład „zakup systemu do zamówień”.' } },
        { id: 'w3', typ: 'tabela', et: 'Krok 3. Korzyści po wdrożeniu',
          kol: [ { id: 'kor', t: 'Korzyść', typ: 'obszar', s: 2 },
                 { id: 'rodz', t: 'Rodzaj', typ: 'wybor', op: ['twarda', 'miękka'], s: .9 },
                 { id: 'kw', t: 'Kwota rocznie (zł)', typ: 'liczba', s: 1 },
                 { id: 'jak', t: 'Jak wyliczono', typ: 'obszar', s: 1.8 },
                 { id: 'zr', t: 'Źródło danych', typ: 'tekst', s: 1.2 } ], suma: 'kw', sumaWg: 'rodz', sumaEt: 'Korzyści razem',
          wyj: { po: 'Korzyści pokazują, o ile projekt zmniejszy stratę z kroku 1. Sponsor porównuje je z kosztem projektu.',
            jak: 'Dla każdej straty z kroku 1 oceńcie, jaką jej część usunie rozwiązanie, i zapiszcie rachunek. Oszczędność twarda zmniejsza wydatki albo zwiększa przychód. Oszczędność miękka uwalnia czas pracy; staje się korzyścią finansową tylko wtedy, gdy Spółka przeznaczy ten czas na inne zadania, o czym decyduje sponsor.',
            p1: 'Mniej zamówień pilnych · twarda · 12 000 zł · 60% z 20 000 zł', p2: 'Krótsze uzgodnienia · miękka · 18 000 zł · połowa z 36 000 zł',
            blad: 'Zaliczenie uwolnionego czasu pracy do oszczędności twardych. Czas staje się pieniędzmi dopiero wtedy, gdy Spółka zmniejszy wydatki albo wykona dodatkową pracę.' } },
        { id: 'w4', typ: 'tabela', et: 'Krok 4. Korzyści bez kwoty',
          kol: [ { id: 'kor', t: 'Korzyść', typ: 'obszar', s: 2 }, { id: 'mia', t: 'Miara albo wycena ryzyka', typ: 'obszar', s: 2 }, { id: 'zr', t: 'Źródło danych', typ: 'tekst', s: 1.2 } ],
          wyj: { po: 'Nie każdą korzyść da się wiarygodnie wyrazić w złotych. Ta tabela pokazuje korzyści, które mają znaczenie dla Spółki, choć nie mają kwoty.',
            jak: 'Dla każdej korzyści podajcie miarę, po której poznacie zmianę, albo wycenę ryzyka (prawdopodobieństwo × koszt zdarzenia).',
            p1: 'Szybsze rozpoczęcie remontów dla najemców · średnia liczba dni od zgłoszenia potrzeby do podpisania zamówienia · rejestr zamówień',
            p2: 'Mniejsze ryzyko kary za odpowiedź po terminie · liczba pism po terminie w kwartale · rejestr kancelarii' } },
        { id: 'w5', typ: 'tabela', et: 'Krok 5. Ramowy budżet projektu',
          kol: [ { id: 'poz', t: 'Pozycja', typ: 'obszar', s: 2.4 }, { id: 'kw', t: 'Kwota (zł)', typ: 'liczba', s: 1 }, { id: 'zr', t: 'Źródło albo sposób wyliczenia', typ: 'obszar', s: 2 } ], suma: 'kw', sumaEt: 'Budżet razem',
          wyj: { po: 'Ramowy budżet to kwota, jaką sponsor dopuszcza na projekt, zanim powstanie budżet szczegółowy na D03. Od niej liczona jest korzyść netto.',
            jak: 'Uwzględnijcie czas pracy zespołu i innych pracowników (godziny × ' + STAWKA_GODZ + ' zł) oraz zakupy i usługi zewnętrzne.',
            p1: 'Czas zespołu: 3 osoby × 40 h × 60 zł · 7 200 zł', p2: 'Elektroniczny formularz w istniejącym systemie · 5 000 zł · wycena dostawcy systemu',
            blad: 'Pominięcie czasu pracy zespołu. To także jest koszt projektu, nawet jeśli Spółka nie płaci za niego osobno.' } },
        { id: 'w6', typ: 'wyliczenie', et: 'Krok 6. Korzyść netto w pierwszym roku',
          wyj: { po: 'Korzyść netto pokazuje, czy projekt zwraca się w pierwszym roku. Strona liczy ją sama z kroków 3 i 5, osobno dla oszczędności twardych oraz dla twardych i miękkich razem.',
            jak: 'Nic nie wpisujecie. Sprawdźcie, czy wynik jest zgodny z waszym rozumieniem projektu.' } },
        { id: 'w7', typ: 'wybor', et: 'Krok 7. Pewność szacunku', op: ['niska', 'średnia', 'wysoka'],
          wyj: { po: 'Sponsor akceptuje kartę na podstawie szacunków. Pewność mówi mu, na ile może na nich polegać.',
            jak: 'Wysoka: kwoty pochodzą z dokumentów. Średnia: część kwot pochodzi z pomiaru na małej próbie. Niska: kwoty są szacunkami osób z działu.',
            p1: 'średnia', p2: 'niska' },
          dod: { id: 'w7u', typ: 'obszar', et: 'Uzasadnienie',
            wyj: { po: 'Uzasadnienie pokazuje, które kwoty są pewne, a które wymagają sprawdzenia.', jak: 'Wymieńcie, skąd pochodzą najważniejsze kwoty.',
              p1: 'Dopłaty pochodzą z faktur; czas uzgodnień zmierzono tylko na 10 zamówieniach; koszt korekt i ryzyko to szacunki.', p2: 'Wszystkie kwoty to szacunki kierownika działu; dane zbierzemy w diagnozie.' } } },
        { id: 'w8', typ: 'obszar', et: 'Krok 8. Dane do zebrania w diagnozie',
          wyj: { po: 'Lista danych, które zespół zbierze w diagnozie, żeby sponsor mógł na KM1 (D06) potwierdzić wartość projektu. Z tej listy powstaje plan diagnozy na D03.',
            jak: 'Dla każdej kwoty o pewności niskiej lub średniej wpiszcie, jakie dane ją potwierdzą, kto je ma i jak je zbierzecie.',
            p1: 'Pomiar czasu uzgodnień na 30 zamówieniach (dział zamówień); lista zamówień pilnych z przyczynami; potwierdzenie stawki 60 zł w księgowości.',
            p2: 'Zestawienie różnic inwentaryzacyjnych z trzech lat (Główna Księgowa); czas korekt przy zamknięciu roku.' } }
      ]},
      { id: 's4', nr: 4, t: 'Cel projektu', pola: [
        { id: 'cel', typ: 'obszar', et: 'Cel w jednym zdaniu',
          wyj: { po: 'Cel mówi, po czym sponsor pozna, że projekt się udał. Z celu wynikają kryteria sukcesu, a na końcu projektu zespół porównuje z nim wynik.',
            jak: 'Napiszcie jedno zdanie: co ma się zmienić, z jakiej wartości do jakiej i do kiedy. Cel wynika ze straty opisanej w sekcji 3.',
            opis: 'Czasownik zmiany (skrócić, zmniejszyć, zwiększyć), miernik, wartość obecna, wartość docelowa, termin.',
            p1: 'Skrócić czas od zgłoszenia potrzeby do podpisania zamówienia z 12 do 5 dni roboczych do 30 czerwca 2027 r.',
            p2: 'Zmniejszyć liczbę pism, na które odpowiadamy po terminie, z 40 do 5 w kwartale do 31 maja 2027 r.',
            blad: 'Cel bez liczby i terminu, na przykład „usprawnić zamówienia”. Takiego celu nie da się sprawdzić.' } },
        { id: 'cel_m', typ: 'tekst', et: 'Miernik',
          wyj: { po: 'Miernik mówi, co dokładnie zespół będzie liczyć, żeby sprawdzić, czy cel został osiągnięty. Wartość obecna i docelowa to dwie liczby tego samego miernika.',
            jak: 'Weźcie stratę z kroku 1 i zapytajcie: co trzeba policzyć, żeby zobaczyć, że ta strata się zmniejsza? Dobry miernik ma jednostkę, określony sposób liczenia (od czego do czego) i da się go policzyć z dostępnych danych.',
            skad: 'Te same źródła co przy wartości obecnej.',
            p1: 'Średnia liczba dni roboczych od zgłoszenia potrzeby do podpisania zamówienia', p2: 'Liczba pism w kwartale, na które Spółka odpowiedziała po terminie',
            blad: 'Wpisanie działania zamiast miernika, na przykład „wdrożenie elektronicznego obiegu”. To jest rezultat projektu, a nie miara jego efektu.' } },
        { id: 'cel_o', typ: 'tekst', et: 'Wartość obecna',
          wyj: { po: 'Wartość obecna to punkt odniesienia. Bez niej nie da się powiedzieć, o ile projekt poprawił sytuację.',
            jak: 'Policzcie miernik z danych z ostatnich 3–12 miesięcy. Jeśli danych nie ma, zmierzcie go sami przez tydzień lub dwa. Te same dane wykorzystajcie w kroku 1 sekcji 3, żeby nie zbierać ich dwa razy.',
            skad: 'Rejestr zamówień, rejestr korespondencji w kancelarii, ewidencja środków trwałych, system księgowy; gdy ich brak, własny krótki pomiar.',
            p1: 'Średnio 12 dni roboczych', p2: '40 pism po terminie w III kwartale 2026 r.' } },
        { id: 'cel_zr', typ: 'tekst', et: 'Źródło i pewność wartości obecnej',
          wyj: { po: 'Pokazuje, skąd pochodzi wartość obecna i czy to pomiar, czy szacunek. Szacunek zespół sprawdza w diagnozie.',
            jak: 'Podajcie źródło, okres i liczbę przypadków oraz pewność: niska, średnia albo wysoka.',
            p1: 'Rejestr zamówień, styczeń–październik 2026, 330 zamówień; pewność wysoka', p2: 'Szacunek kierownika kancelarii; pewność niska, do sprawdzenia w diagnozie' } },
        { id: 'cel_d', typ: 'tekst', et: 'Wartość docelowa',
          wyj: { po: 'Wartość docelowa mówi, jaki wynik sponsor uzna za sukces projektu.',
            jak: 'Ustalcie ją ze sponsorem. Powinna wynikać z korzyści z kroku 3: jeśli zakładacie skrócenie uzgodnień o połowę, wartość docelowa powinna to odzwierciedlać.',
            p1: '5 dni roboczych', p2: 'najwyżej 5 pism po terminie w kwartale' } },
        { id: 'cel_t', typ: 'tekst', et: 'Termin osiągnięcia',
          wyj: { po: 'Termin mówi, kiedy zespół zmierzy wynik i porówna go z wartością docelową.',
            jak: 'Korzyści pojawiają się zwykle kilka miesięcy po wdrożeniu, czyli często po zakończeniu Akademii. Podajcie realny termin pomiaru.',
            p1: '30 czerwca 2027 r.', p2: 'koniec II kwartału 2027 r.' } }
      ]},
      { id: 's5', nr: 5, t: 'Rezultaty i zakres', pola: [
        { id: 'rez_p', typ: 'obszar', et: 'Co powstanie w projekcie?',
          wyj: { po: 'Opis produktu mówi sponsorowi, co konkretnie dostanie Spółka na koniec projektu.',
            opis: 'Nazwa produktu (procedura, formularz, narzędzie, rejestr, obieg dokumentów); dla kogo; co robi, czyli jaką czynność zastępuje albo usprawnia; forma (dokument, funkcja w systemie, nowe narzędzie); zakres, czyli czego dotyczy, a czego nie.',
            p1: 'Elektroniczny formularz zamówienia w systemie obiegu dokumentów dla działów zgłaszających potrzebę i działu zamówień. Zastępuje papierowy wniosek i ręczne przepisywanie danych, prowadzi przez wymagane uzgodnienia i pokazuje etap zamówienia. Obejmuje zamówienia poniżej progu ustawowego.',
            p2: 'Procedura inwentaryzacji środków trwałych z kartą lokalizacji każdego środka, dla działu administracji i księgowości. Ustala, kto i kiedy aktualizuje ewidencję po przeniesieniu, likwidacji albo zakupie środka. Obejmuje środki w biurze i w budynkach, nie obejmuje wyposażenia lokali najemców.',
            blad: 'Wpisanie celu albo efektu zamiast produktu, na przykład „sprawniejsze zamówienia”. To zmiana, którą produkt ma wywołać; należy do następnego pola.' } },
        { id: 'rez_e', typ: 'obszar', et: 'Co zmieni się w pracy Spółki?',
          wyj: { po: 'Efekt to zmiana w codziennej pracy, z której biorą się korzyści z sekcji 3.',
            jak: 'Opiszcie, jak będzie wyglądała praca po wdrożeniu produktu: kto co będzie robił inaczej.',
            p1: 'Pracownik zgłasza potrzebę w formularzu, a dział zamówień widzi ją od razu; uzgodnienia odbywają się w systemie, bez przepisywania danych.', p2: 'Każda zmiana lokalizacji środka trwałego jest zapisywana od razu przez osobę odpowiedzialną, a inwentaryzacja potwierdza stan zamiast go odtwarzać.' } },
        { id: 'zak_t', typ: 'obszar', et: 'Projekt obejmuje',
          wyj: { po: 'Granice zakresu chronią projekt przed niekontrolowanym rozrastaniem.', jak: 'Wymieńcie procesy, działy, lokalizacje i rodzaje spraw, których dotyczy projekt.',
            p1: 'Zamówienia poniżej progu ustawowego zgłaszane przez dział techniczny i administracji.', p2: 'Środki trwałe w siedzibie Spółki i w budynkach mieszkalnych.' } },
        { id: 'zak_n', typ: 'obszar', et: 'Projekt nie obejmuje',
          wyj: { po: 'Pokazuje, co świadomie zostaje poza projektem, żeby nikt nie oczekiwał tego od zespołu.', jak: 'Wpiszcie sprawy bliskie projektowi, którymi zespół się nie zajmie.',
            p1: 'Postępowania powyżej progu ustawowego; wybór dostawców.', p2: 'Wyposażenie lokali najemców; wartości niematerialne i prawne.' } }
      ]},
      { id: 's6', nr: 6, t: 'Kryteria sukcesu', pola: [
        { id: 'kr_r', typ: 'obszar', et: 'Kryteria rezultatu',
          wyj: { po: 'Kryteria mówią, po czym sponsor pozna, że rozwiązanie działa i ludzie z niego korzystają. Na ich podstawie sponsor odbiera rezultat projektu.',
            jak: 'Wpiszcie dwa lub trzy warunki, które da się sprawdzić: kto korzysta, w jakim zakresie, od kiedy.',
            p1: 'Wszystkie zamówienia działu technicznego i administracji przechodzą przez formularz od 1 kwietnia 2027 r.', p2: 'Ewidencja zgadza się ze stanem faktycznym w co najmniej 98% pozycji przy inwentaryzacji kontrolnej.',
            blad: 'Kryterium, którego nie da się sprawdzić, na przykład „pracownicy są zadowoleni”.' } }
      ]},
      { id: 's7', nr: 7, t: 'Etapy projektu i kluczowe działania', pola: [
        { id: 'etapy', typ: 'etapy', et: 'Kluczowe działania w etapach projektu',
          wyj: { po: 'Działania pokazują sponsorowi, co zespół zrobi w każdym etapie projektu. Z tej listy powstanie plan projektu na D02 i D03.',
            jak: 'Pod każdym etapem dodajcie dwa lub trzy najważniejsze działania waszego projektu. Kolejność ustawiacie strzałkami.',
            p1: 'Diagnoza: „Pomiar czasu 30 zamówień w działach technicznym i administracji”; „Zestawienie zamówień w trybie pilnym z 2025 r. z przyczynami”.',
            p2: 'Przygotowanie wdrożenia: „Szkolenie pracowników działu administracji z nowej procedury inwentaryzacji”; „Uzgodnienie zmian w ewidencji z Główną Księgową”.' } }
      ]},
      { id: 's8', nr: 8, t: 'Właściciel rozwiązania', pola: [
        { id: 'zak_w', typ: 'tekst', et: 'Właściciel rozwiązania po Akademii',
          wyj: { po: 'Korzyści pojawią się głównie po zakończeniu Akademii. Właściciel przejmuje rozwiązanie, pilnuje jego stosowania i mierzy korzyści.',
            jak: 'Wskażcie osobę, w której dziale rozwiązanie będzie działało, i uzgodnijcie to z nią oraz ze sponsorem.',
            p1: 'Kierownik działu zamówień: przejmuje formularz, pilnuje jego stosowania i co kwartał mierzy czas obsługi zamówień.', p2: 'Główna Księgowa: odpowiada za procedurę inwentaryzacji i raz w roku porównuje ewidencję ze stanem faktycznym.' } }
      ]},
      { id: 's9', nr: 9, t: 'Akceptacja sponsora', akceptacja: true }
    ]
  }
};
