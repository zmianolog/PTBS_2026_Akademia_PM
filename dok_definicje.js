/* Definicje dokumentów projektowych Akademii. Każdy dokument to lista sekcji, a sekcja to lista pól.
   Typy pól: tekst, obszar, liczba, wybor, tabela, etapy (działania w etapach projektu),
   wyliczenie (tylko do odczytu); sekcja z kroki: true pokazuje pola krok po kroku.
   Pole „wyj” to wyjaśnienie: po (po co), jak (jak ustalić), skad (skąd dane), opis (z czego składa się dobry opis),
   p1 i p2 (przykłady), blad (najczęstszy błąd).
   Przykłady pochodzą z procesów PTBS, których nie dotyczą projekty Akademii: obsługi zgłoszeń awarii od najemców,
   windykacji zaległości czynszowych i rozliczania mediów. */
const ZESPOLY = PROGRAM.zespoly;
const SPONSOR = Object.values(PROGRAM.zespoly)[0].sponsor;
const STAWKA_GODZ = 60; /* zł za godzinę pracy, do potwierdzenia przez księgowość */

const ETAPY_KARTY = [
  { id: 'e1', n: 'Uruchomienie', sp: 'D00–D02', km: 'Akceptacja karty projektu',
    co: 'Zespół opisuje problem, wartość, produkt, rezultat i zakres projektu oraz ustala sposób pracy. Etap kończy się akceptacją karty przez sponsora na D02; bez tej decyzji zespół nie zaczyna diagnozy.',
    pr: ['Spotkanie zespołu z właścicielem procesu obsługi awarii w sprawie zakresu projektu', 'Zebranie liczby zgłoszeń awarii z ostatnich 12 miesięcy do karty projektu'] },
  { id: 'e2', n: 'Diagnoza', sp: 'D03–D06', km: 'KM1 · Diagnoza stanu obecnego',
    co: 'Zespół zbiera dane o tym, jak proces działa dziś, i ustala przyczyny problemu. Sprawdza też kwoty z karty. Etap kończy się na KM1 (D06), gdy sponsor potwierdza wartość projektu na podstawie danych.',
    pr: ['Zestawienie zgłoszeń awarii z 12 miesięcy według czasu od zgłoszenia do usunięcia', 'Rozmowy z pięcioma administratorami budynków o przyczynach opóźnień'] },
  { id: 'e3', n: 'Koncepcja rozwiązania', sp: 'D07–D08', km: 'KM2 · Zatwierdzenie koncepcji',
    co: 'Zespół projektuje rozwiązanie, które usuwa przyczyny ustalone w diagnozie, i porównuje warianty. Etap kończy się na KM2 (D08), gdy sponsor wybiera i zatwierdza koncepcję.',
    pr: ['Opis dwóch wariantów przyjmowania zgłoszeń: formularz na stronie i jeden numer telefonu', 'Wycena wariantów z działem informatyki'] },
  { id: 'e4', n: 'Przygotowanie wdrożenia', sp: 'D09–D10', km: 'KM3 · Gotowość do pilotażu; KM4 · Uruchomienie pilotażu',
    co: 'Zespół wykonuje produkt, przygotowuje ludzi do zmiany i sprawdza rozwiązanie w pilotażu na małej części Spółki. Etap kończy się, gdy pilotaż działa i zespół zna jego wyniki.',
    pr: ['Przygotowanie formularza zgłoszenia awarii i instrukcji dla najemców', 'Pilotaż w dwóch budynkach przez cztery tygodnie'] },
  { id: 'e5', n: 'Wdrożenie', sp: 'D11–D13', km: 'Przekazanie rozwiązania właścicielowi',
    co: 'Zespół wprowadza rozwiązanie w całym zakresie projektu i poprawia to, co wykazał pilotaż. Etap kończy się przekazaniem rozwiązania właścicielowi na D13.',
    pr: ['Uruchomienie formularza we wszystkich budynkach', 'Szkolenie administratorów budynków z obsługi zgłoszeń w nowym trybie'] },
  { id: 'e6', n: 'Działanie i korzyści', sp: 'po Akademii', km: 'Pomiar rezultatu',
    co: 'Właściciel rozwiązania pilnuje, żeby rozwiązanie było stosowane, i mierzy rezultat. W terminie podanym w karcie porównuje zmierzony rezultat z wartością docelową.',
    pr: ['Kwartalny pomiar średniego czasu usunięcia awarii', 'Przegląd zgłoszeń, w których przekroczono termin, z kierownikiem działu technicznego'] }
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

/* sposób współpracy z interesariuszem wynika z wpływu i zainteresowania */
const WSPOLPRACA = [
  { wpl: 'wysoki', zai: 'wysokie', n: 'ścisła współpraca', o: 'udział w decyzjach i stały kontakt' },
  { wpl: 'wysoki', zai: 'niskie', n: 'uzgadnianie decyzji', o: 'kontakt przy decyzjach, które go dotyczą' },
  { wpl: 'niski', zai: 'wysokie', n: 'regularne informowanie', o: 'informacja o postępach i zmianach' },
  { wpl: 'niski', zai: 'niskie', n: 'obserwowanie', o: 'kontakt, gdy zmieni się jego sytuacja' }
];
const sposobWspolpracy = r => { const w = WSPOLPRACA.find(x => x.wpl === r.wpl && x.zai === r.zai); return w ? w.n : ''; };
const wlascicielProcesu = z => { const c = ZESPOLY[z].czlonkowie.find(c => /właściciel/i.test(c.rola)); return c ? c.imie : ''; };

const DOKUMENTY = {
  T01: {
    nazwa: 'Karta projektu',
    instr: {
      po: 'Karta opisuje, jaki problem rozwiązuje projekt, ile ten problem kosztuje Spółkę, jaki produkt wytworzy zespół, jaki rezultat ma przynieść projekt i kto przejmie rozwiązanie po zakończeniu projektu. Na podstawie karty sponsor decyduje, czy zespół rozpoczyna diagnozę.',
      kto: 'Wypełnia cały zespół projektowy. Każdy członek zespołu może zmieniać każde pole; strona zapisuje autora i datę każdej zmiany w rejestrze zmian.',
      kiedy: 'Zespół zaczyna kartę po spotkaniu D00 i uzupełnia ją do spotkania D02. Karta jest dokumentem roboczym: do akceptacji można ją zmieniać.',
      akc: 'Sponsor akceptuje kartę na spotkaniu D02. Po diagnozie, na kamieniu milowym KM1 (D06), sponsor potwierdza wartość projektu na podstawie zebranych danych.',
      brak: 'Bez karty zespół i sponsor mogą inaczej rozumieć, po co jest projekt i co ma przynieść; zespół nie ma też podstawy do planu diagnozy.'
    },
    sekcje: [
      { id: 's1', nr: 1, t: 'Metryczka', pola: [
        { id: 'nazwa_proj', typ: 'tekst', et: 'Nazwa projektu', dom: z => ZESPOLY[z].projekt,
          wyj: { po: 'Nazwa pozwala jednoznacznie wskazać projekt w rozmowach, raportach i dokumentach Spółki.', jak: 'Nazwa jest wpisana z programu Akademii. Zmieńcie ją, jeśli w Spółce projekt funkcjonuje pod inną nazwą.',
            p1: 'Skrócenie czasu usuwania awarii zgłaszanych przez najemców', p2: 'Usprawnienie windykacji zaległości czynszowych' } },
        { id: 'nazwa_zesp', typ: 'tekst', et: 'Nazwa zespołu',
          wyj: { po: 'Krótka nazwa, pod którą zespół występuje na spotkaniach Akademii i w prezentacji dla Zarządu.', jak: 'Wybierzcie nazwę krótką, łatwą do zapamiętania, związaną z projektem.',
            p1: 'Zespół Awarie', p2: 'Zespół Należności' } },
        { id: 'sponsor', typ: 'tekst', et: 'Sponsor', dom: () => SPONSOR,
          wyj: { po: 'Sponsor podejmuje decyzje, których zespół nie może podjąć sam, zatwierdza kartę i koncepcję oraz zapewnia zasoby.', jak: 'Wpisany z programu Akademii.',
            p1: 'Konrad Gieżek, wiceprezes Zarządu', p2: 'Konrad Gieżek' } },
        { id: 'lider', typ: 'tekst', et: 'Lider projektu', dom: z => ZESPOLY[z].lider,
          wyj: { po: 'Lider odpowiada za prowadzenie projektu, kontakt ze sponsorem i rozliczanie ustaleń w zespole.', jak: 'Wpisany z programu Akademii (kierownik projektu w zespole).',
            p1: 'Kierownik działu technicznego', p2: 'Specjalista do spraw windykacji' } },
        { id: 'czlonkowie', typ: 'obszar', et: 'Członkowie zespołu', dom: z => ZESPOLY[z].czlonkowie.map(c => c.imie + ' – ' + c.rola).join('\n'),
          wyj: { po: 'Lista pokazuje, kto pracuje przy projekcie i w jakiej roli; dzięki niej sponsor wie, kogo projekt angażuje.', jak: 'Wpiszcie stały skład zespołu oraz osoby spoza zespołu, które będą pracować przy projekcie, z działem i rolą.',
            opis: 'Imię i nazwisko, dział, rola w projekcie.',
            p1: 'Jan Nowak – dział techniczny – uczestnik procesu', p2: 'Anna Kowalska – administracja budynków – udział w diagnozie' } }
      ]},
      { id: 's2', nr: 2, t: 'Problem', pola: [
        { id: 'pr_co', typ: 'obszar', et: 'Co dziś nie działa?',
          wyj: { po: 'Opis problemu jest punktem wyjścia całej karty: z niego wynika strata, produkt i rezultat projektu.', jak: 'Opiszcie sytuację tak, jak wygląda dziś: co się dzieje, jak często i z jakim skutkiem. Nie proponujcie jeszcze rozwiązania.',
            opis: 'Co się dzieje, jak często, jaki jest skutek dla Spółki.',
            p1: 'Usunięcie awarii zgłoszonej przez najemcę trwa średnio 9 dni roboczych. Zgłoszenia przychodzą telefonicznie, mailowo i osobiście, a administrator budynku przepisuje je ręcznie; część zgłoszeń ginie i najemcy dzwonią ponownie.',
            p2: 'Pierwsze wezwanie do zapłaty trafia do najemcy średnio 45 dni po terminie płatności czynszu. W tym czasie zaległość rośnie, a część spraw trafia do sądu, choć mogłaby zakończyć się ugodą.',
            blad: 'Opis rozwiązania zamiast problemu, na przykład „brak systemu do zgłaszania awarii”. To jest jedno z możliwych rozwiązań, a nie opis tego, co dziś nie działa.' } },
        { id: 'pr_kogo', typ: 'obszar', et: 'Kogo problem dotyczy?',
          wyj: { po: 'Wskazuje, czyja praca się zmieni i kogo trzeba zaangażować w diagnozę i wdrożenie.', jak: 'Wymieńcie działy, stanowiska i osoby z zewnątrz (najemców, kontrahentów), których problem dotyczy.',
            p1: 'Najemcy, administratorzy budynków, dział techniczny, firmy wykonujące naprawy.', p2: 'Dział windykacji, księgowość, radca prawny, najemcy z zaległościami.' } },
        { id: 'pr_skad', typ: 'obszar', et: 'Skąd wiecie, że problem istnieje?',
          wyj: { po: 'Pokazuje, na jakich danych opiera się opis problemu; sponsor ocenia na tej podstawie, czy problem jest dobrze rozpoznany.', jak: 'Podajcie źródło i, jeśli możecie, liczbę. Wskażcie, kto może udostępnić dane.',
            skad: 'Rejestry działów, system księgowy, skargi najemców, obserwacja własnej pracy.',
            p1: 'Rejestr zgłoszeń 2025: 2 100 zgłoszeń awarii, 180 skarg najemców na czas naprawy; dane udostępni dział techniczny.', p2: 'Zestawienie należności 2025: 320 spraw z zaległością powyżej 60 dni, 40 pozwów; dane ma księgowość.',
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
            p1: 'A czas pracy · Przepisywanie zgłoszeń awarii i ponowne telefony najemców: 2 100 zgłoszeń × 0,5 h × 60 zł · 63 000 zł · rejestr zgłoszeń 2025 i pomiar 20 zgłoszeń · średnia',
            p2: 'C utracony przychód · Odsetki i koszty niezasądzone w sprawach skierowanych do sądu: 40 spraw × 900 zł · 36 000 zł · zestawienie należności 2025 · wysoka',
            blad: 'Liczenie tej samej straty dwa razy, na przykład czasu poprawek w rodzaju A i w rodzaju D.' } },
        { id: 'w2', typ: 'obszar', et: 'Krok 2. Potrzeba',
          wyj: { po: 'Potrzeba mówi, czego Spółka potrzebuje, żeby strata zniknęła albo się zmniejszyła. Zostawia miejsce na wybór rozwiązania w etapie koncepcji.', jak: 'Opiszcie, jaki stan chcecie osiągnąć, bez wskazywania konkretnego narzędzia.',
            p1: 'Jedno miejsce przyjmowania zgłoszeń awarii, w którym najemca i dział techniczny widzą, na jakim etapie jest naprawa.', p2: 'Kontakt z najemcą w pierwszych dniach po terminie płatności, zanim zaległość urośnie.',
            blad: 'Wpisanie gotowego rozwiązania, na przykład „zakup aplikacji do zgłoszeń”.' } },
        { id: 'w3', typ: 'tabela', et: 'Krok 3. Korzyści po wdrożeniu',
          kol: [ { id: 'kor', t: 'Korzyść', typ: 'obszar', s: 2 },
                 { id: 'rodz', t: 'Rodzaj', typ: 'wybor', op: ['twarda', 'miękka'], s: .9 },
                 { id: 'kw', t: 'Kwota rocznie (zł)', typ: 'liczba', s: 1 },
                 { id: 'jak', t: 'Jak wyliczono', typ: 'obszar', s: 1.8 },
                 { id: 'zr', t: 'Źródło danych', typ: 'tekst', s: 1.2 } ], suma: 'kw', sumaWg: 'rodz', sumaEt: 'Korzyści razem',
          wyj: { po: 'Korzyści pokazują, o ile projekt zmniejszy stratę z kroku 1. Sponsor porównuje je z kosztem projektu.',
            jak: 'Dla każdej straty z kroku 1 oceńcie, jaką jej część usunie rozwiązanie, i zapiszcie rachunek. Oszczędność twarda zmniejsza wydatki albo zwiększa przychód. Oszczędność miękka uwalnia czas pracy; staje się korzyścią finansową tylko wtedy, gdy Spółka przeznaczy ten czas na inne zadania, o czym decyduje sponsor.',
            p1: 'Mniej spraw sądowych · twarda · 18 000 zł · połowa z 36 000 zł', p2: 'Brak przepisywania zgłoszeń · miękka · 42 000 zł · dwie trzecie z 63 000 zł',
            blad: 'Zaliczenie uwolnionego czasu pracy do oszczędności twardych. Czas staje się pieniędzmi dopiero wtedy, gdy Spółka zmniejszy wydatki albo wykona dodatkową pracę.' } },
        { id: 'w4', typ: 'tabela', et: 'Krok 4. Korzyści bez kwoty',
          kol: [ { id: 'kor', t: 'Korzyść', typ: 'obszar', s: 2 }, { id: 'mia', t: 'Miara albo wycena ryzyka', typ: 'obszar', s: 2 }, { id: 'zr', t: 'Źródło danych', typ: 'tekst', s: 1.2 } ],
          wyj: { po: 'Nie każdą korzyść da się wiarygodnie wyrazić w złotych. Ta tabela pokazuje korzyści, które mają znaczenie dla Spółki, choć nie mają kwoty.',
            jak: 'Dla każdej korzyści podajcie miarę, po której poznacie zmianę, albo wycenę ryzyka (prawdopodobieństwo × koszt zdarzenia).',
            p1: 'Mniej skarg najemców na czas naprawy · liczba skarg w kwartale · rejestr skarg',
            p2: 'Lepsze relacje z najemcami w trudnej sytuacji · liczba zawartych ugód ratalnych · dział windykacji' } },
        { id: 'w5', typ: 'tabela', et: 'Krok 5. Ramowy budżet projektu',
          kol: [ { id: 'poz', t: 'Pozycja', typ: 'obszar', s: 2.4 }, { id: 'kw', t: 'Kwota (zł)', typ: 'liczba', s: 1 }, { id: 'zr', t: 'Źródło albo sposób wyliczenia', typ: 'obszar', s: 2 } ], suma: 'kw', sumaEt: 'Budżet razem',
          wyj: { po: 'Ramowy budżet to kwota, jaką sponsor dopuszcza na projekt, zanim powstanie budżet szczegółowy na D03. Od niej liczona jest korzyść netto.',
            jak: 'Uwzględnijcie czas pracy zespołu i innych pracowników (godziny × ' + STAWKA_GODZ + ' zł) oraz zakupy i usługi zewnętrzne.',
            p1: 'Czas zespołu: 3 osoby × 40 h × 60 zł · 7 200 zł', p2: 'Formularz zgłoszenia awarii na stronie Spółki · 6 000 zł · wycena dostawcy strony',
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
              p1: 'Liczba zgłoszeń pochodzi z rejestru; czas przepisywania zmierzono tylko na 20 zgłoszeniach.', p2: 'Wszystkie kwoty to szacunki kierownika działu; dane zbierzemy w diagnozie.' } } },
        { id: 'w8', typ: 'obszar', et: 'Krok 8. Dane do zebrania w diagnozie',
          wyj: { po: 'Lista danych, które zespół zbierze w diagnozie, żeby sponsor mógł na KM1 (D06) potwierdzić wartość projektu. Z tej listy powstaje plan diagnozy na D03.',
            jak: 'Dla każdej kwoty o pewności niskiej lub średniej wpiszcie, jakie dane ją potwierdzą, kto je ma i jak je zbierzecie.',
            p1: 'Pomiar czasu obsługi 50 zgłoszeń awarii (administratorzy budynków); potwierdzenie stawki 60 zł w księgowości.',
            p2: 'Zestawienie spraw sądowych z trzech lat z kosztami niezasądzonymi (radca prawny).' } }
      ]},
      { id: 's4', nr: 4, t: 'Produkt projektu', pola: [
        { id: 'rez_p', typ: 'obszar', et: 'Co zespół wytworzy?',
          wyj: { po: 'Produkt to to, co zespół wytworzy i przekaże Spółce na koniec projektu. Produkt wywołuje zmianę opisaną w sekcji 5 „Rezultat projektu (cel)”.',
            opis: 'Nazwa produktu (procedura, formularz, narzędzie, rejestr, obieg dokumentów); dla kogo; jaką czynność zastępuje albo usprawnia i kto będzie pracował inaczej; forma (dokument, funkcja w systemie, nowe narzędzie).',
            p1: 'Formularz zgłoszenia awarii na stronie Spółki dla najemców i administratorów budynków. Zastępuje zgłoszenia telefoniczne i mailowe oraz ręczne przepisywanie; administrator przydziela zgłoszenie wykonawcy w systemie, a najemca widzi etap naprawy.',
            p2: 'Procedura wczesnej windykacji z harmonogramem kontaktów od 5. dnia po terminie płatności i wzorami pism, dla działu windykacji. Specjalista kontaktuje się z najemcą telefonicznie przed wysłaniem pierwszego wezwania.',
            blad: 'Wpisanie zmiany zamiast produktu, na przykład „szybsze usuwanie awarii”. To jest rezultat, który ma przynieść produkt; należy do sekcji 5.' } },
        { id: 'kr_r', typ: 'obszar', et: 'Kryteria odbioru produktu',
          wyj: { po: 'Kryteria mówią, po czym sponsor pozna, że produkt jest gotowy i używany. Na ich podstawie sponsor odbiera produkt na koniec projektu.',
            jak: 'Wpiszcie dwa lub trzy warunki, które da się sprawdzić w dniu zakończenia projektu: co działa, kto z tego korzysta, od kiedy.',
            p1: 'Wszystkie zgłoszenia awarii z budynków objętych projektem są przyjmowane przez formularz od 1 kwietnia 2027 r.', p2: 'Dział windykacji stosuje procedurę wobec wszystkich nowych zaległości od 1 marca 2027 r.; wzory pism są w systemie.',
            blad: 'Kryterium, którego nie da się sprawdzić, na przykład „pracownicy są zadowoleni”.' } }
      ]},
      { id: 's5', nr: 5, t: 'Rezultat projektu (cel)', pola: [
        { id: 'cel', typ: 'obszar', et: 'Cel w jednym zdaniu',
          wyj: { po: 'Cel to zaplanowany rezultat projektu: zmiana wyniku Spółki, którą ma wywołać produkt z sekcji 4. Rezultat zespół zmierzy po wdrożeniu i porówna z celem.',
            jak: 'Napiszcie jedno zdanie: co ma się zmienić, z jakiej wartości do jakiej i do kiedy. Cel wynika ze straty opisanej w sekcji 3.',
            opis: 'Czasownik zmiany (skrócić, zmniejszyć, zwiększyć), miernik, wartość obecna, wartość docelowa, termin.',
            p1: 'Skrócić średni czas od zgłoszenia awarii do jej usunięcia z 9 do 4 dni roboczych do 30 czerwca 2027 r.',
            p2: 'Zmniejszyć liczbę spraw windykacyjnych kierowanych do sądu z 40 do 20 rocznie do 31 grudnia 2027 r.',
            blad: 'Cel bez liczby i terminu, na przykład „usprawnić obsługę awarii”. Takiego celu nie da się sprawdzić.' } },
        { id: 'cel_m', typ: 'tekst', et: 'Miernik',
          wyj: { po: 'Miernik mówi, co dokładnie zespół będzie liczyć, żeby zmierzyć rezultat. Wartość obecna i docelowa to dwie liczby tego samego miernika.',
            jak: 'Weźcie stratę z kroku 1 i zapytajcie: co trzeba policzyć, żeby zobaczyć, że ta strata się zmniejsza? Dobry miernik ma jednostkę, określony sposób liczenia (od czego do czego) i da się go policzyć z dostępnych danych.',
            skad: 'Te same źródła co przy wartości obecnej.',
            p1: 'Średnia liczba dni roboczych od zgłoszenia awarii do jej usunięcia', p2: 'Liczba spraw windykacyjnych skierowanych do sądu w roku',
            blad: 'Wpisanie działania zamiast miernika, na przykład „uruchomienie formularza”. To jest produkt projektu, a nie miara rezultatu.' } },
        { id: 'cel_o', typ: 'tekst', et: 'Wartość obecna',
          wyj: { po: 'Wartość obecna to punkt odniesienia. Bez niej nie da się powiedzieć, o ile projekt poprawił sytuację.',
            jak: 'Policzcie miernik z danych z ostatnich 3–12 miesięcy. Jeśli danych nie ma, zmierzcie go sami przez tydzień lub dwa. Te same dane wykorzystajcie w kroku 1 sekcji 3, żeby nie zbierać ich dwa razy.',
            skad: 'Rejestry działów, system księgowy, rejestr skarg najemców; gdy ich brak, własny krótki pomiar.',
            p1: 'Średnio 9 dni roboczych', p2: '40 spraw w 2025 r.' } },
        { id: 'cel_zr', typ: 'tekst', et: 'Źródło i pewność wartości obecnej',
          wyj: { po: 'Pokazuje, skąd pochodzi wartość obecna i czy to pomiar, czy szacunek. Szacunek zespół sprawdza w diagnozie.',
            jak: 'Podajcie źródło, okres i liczbę przypadków oraz pewność: niska, średnia albo wysoka.',
            p1: 'Rejestr zgłoszeń, styczeń–październik 2026, 1 750 zgłoszeń; pewność wysoka', p2: 'Szacunek radcy prawnego; pewność niska, do sprawdzenia w diagnozie' } },
        { id: 'cel_d', typ: 'tekst', et: 'Wartość docelowa',
          wyj: { po: 'Wartość docelowa mówi, jaki rezultat sponsor uzna za sukces projektu.',
            jak: 'Ustalcie ją ze sponsorem. Powinna wynikać z korzyści z kroku 3: jeśli zakładacie zmniejszenie liczby spraw sądowych o połowę, wartość docelowa powinna to odzwierciedlać.',
            p1: '4 dni robocze', p2: 'najwyżej 20 spraw w roku' } },
        { id: 'cel_t', typ: 'tekst', et: 'Termin pomiaru rezultatu',
          wyj: { po: 'Termin mówi, kiedy zespół albo właściciel rozwiązania zmierzy rezultat i porówna go z wartością docelową.',
            jak: 'Rezultat pojawia się zwykle kilka miesięcy po wdrożeniu, czyli często po zakończeniu Akademii. Podajcie realny termin pomiaru.',
            p1: '30 czerwca 2027 r.', p2: 'koniec 2027 r.' } }
      ]},
      { id: 's6', nr: 6, t: 'Zakres', pola: [
        { id: 'zak_t', typ: 'obszar', et: 'Projekt obejmuje',
          wyj: { po: 'Granice zakresu chronią projekt przed niekontrolowanym rozrastaniem.', jak: 'Wymieńcie procesy, działy, lokalizacje i rodzaje spraw, których dotyczy projekt.',
            p1: 'Awarie w lokalach mieszkalnych i częściach wspólnych budynków zarządzanych przez Spółkę.', p2: 'Zaległości czynszowe najemców lokali mieszkalnych do etapu skierowania sprawy do sądu.' } },
        { id: 'zak_n', typ: 'obszar', et: 'Projekt nie obejmuje',
          wyj: { po: 'Pokazuje, co świadomie zostaje poza projektem, żeby nikt nie oczekiwał tego od zespołu.', jak: 'Wpiszcie sprawy bliskie projektowi, którymi zespół się nie zajmie.',
            p1: 'Remonty planowe; wybór firm wykonujących naprawy.', p2: 'Postępowanie sądowe i egzekucja komornicza; lokale użytkowe.' } }
      ]},
      { id: 's7', nr: 7, t: 'Interesariusze', pola: [
        { id: 'inter', typ: 'tabela', et: 'Interesariusze projektu', macierz: true,
          kol: [ { id: 'kto', t: 'Interesariusz', typ: 'obszar', s: 1.5 },
                 { id: 'ocz', t: 'Czego oczekuje lub czego się obawia', typ: 'obszar', s: 2.4 },
                 { id: 'wpl', t: 'Wpływ na projekt', typ: 'wybor', op: ['niski', 'wysoki'], s: .9 },
                 { id: 'zai', t: 'Zainteresowanie projektem', typ: 'wybor', op: ['niskie', 'wysokie'], s: .9 },
                 { id: 'spos', t: 'Sposób współpracy', typ: 'auto', f: sposobWspolpracy, s: 1.2 } ],
          dom: z => [ { kto: 'Sponsor (' + SPONSOR + ')', ocz: '', wpl: '', zai: '' }, { kto: 'Właściciel procesu (' + wlascicielProcesu(z) + ')', ocz: '', wpl: '', zai: '' } ],
          wyj: { po: 'Analiza pokazuje, kto może wpłynąć na projekt albo kogo projekt dotyczy, i jak zespół będzie z każdą z tych osób lub grup współpracował. Pełniejszą analizę zespół zrobi w narzędziu T02 na D02.',
            jak: 'Wpływ oznacza, czy interesariusz może zatrzymać, opóźnić albo zmienić projekt, na przykład przez decyzję, budżet albo odmowę współpracy. Zainteresowanie oznacza, jak bardzo projekt zmienia jego pracę lub sytuację. Sposób współpracy strona przypisuje sama: wysoki wpływ i wysokie zainteresowanie – ścisła współpraca; wysoki wpływ i niskie zainteresowanie – uzgadnianie decyzji; niski wpływ i wysokie zainteresowanie – regularne informowanie; niski wpływ i niskie zainteresowanie – obserwowanie.',
            opis: 'Pytania pomocnicze: kto podejmuje decyzje w sprawie projektu? Czyja praca się zmieni? Kto dostarcza dane albo zasoby? Kto może opóźnić wdrożenie? Kogo dotyczą skutki problemu?',
            p1: 'Administratorzy budynków · obawiają się dodatkowej pracy przy nowym formularzu · wpływ wysoki · zainteresowanie wysokie · ścisła współpraca',
            p2: 'Firmy wykonujące naprawy · oczekują jasnych zleceń z opisem awarii · wpływ niski · zainteresowanie wysokie · regularne informowanie',
            blad: 'Wpisanie wszystkich działów Spółki bez oceny, kogo projekt naprawdę dotyczy. Tabela traci wtedy znaczenie przy planowaniu współpracy.' } }
      ]},
      { id: 's8', nr: 8, t: 'Etapy projektu i kluczowe działania', pola: [
        { id: 'etapy', typ: 'etapy', et: 'Kluczowe działania w etapach projektu',
          wyj: { po: 'Działania pokazują sponsorowi, co zespół zrobi w każdym etapie projektu. Z tej listy powstanie plan projektu na D02 i D03.',
            jak: 'Przy każdym etapie wpiszcie dwa lub trzy najważniejsze działania waszego projektu. Przycisk „+” dodaje pod wierszem kolejny wiersz tego samego etapu, a krzyżyk usuwa wiersz.',
            etapy: true } }
      ]},
      { id: 's9', nr: 9, t: 'Właściciel rozwiązania', pola: [
        { id: 'zak_w', typ: 'tekst', et: 'Właściciel rozwiązania po Akademii',
          wyj: { po: 'Rezultat pojawi się głównie po zakończeniu Akademii. Właściciel przejmuje rozwiązanie, pilnuje jego stosowania i mierzy rezultat.',
            jak: 'Wskażcie osobę, w której dziale rozwiązanie będzie działało, i uzgodnijcie to z nią oraz ze sponsorem.',
            p1: 'Kierownik działu technicznego: przejmuje formularz zgłoszeń i co kwartał mierzy czas usuwania awarii.', p2: 'Kierownik działu windykacji: odpowiada za procedurę i raz w roku zestawia liczbę spraw skierowanych do sądu.' } }
      ]},
      { id: 's10', nr: 10, t: 'Akceptacja sponsora', akceptacja: true }
    ]
  }
};
