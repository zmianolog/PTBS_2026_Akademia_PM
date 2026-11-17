/* Wygenerowane z arkusza programu Akademii. Nie edytować ręcznie. */
const PROGRAM = {
 "sesje": [
  {
   "kod": "D00",
   "nazwa": "Start Akademii",
   "etap": 1,
   "tn": [],
   "tu": [],
   "przed": "Przeczytaj stronę „O Akademii”.",
   "po": "Zespół zbiera informacje o swoim projekcie: jaki problem ma rozwiązać, czego oczekuje sponsor i jakie dokumenty już istnieją."
  },
  {
   "kod": "D01",
   "nazwa": "Wprowadzenie i inicjacja",
   "etap": 1,
   "tn": [
    "T01",
    "T02"
   ],
   "tu": [],
   "przed": "Przekaż prowadzącemu informacje o projekcie zebrane po spotkaniu D00.",
   "po": "Mapa interesariuszy ze sposobem zaangażowania oraz karta projektu uzgodniona ze sponsorem."
  },
  {
   "kod": "D02",
   "nazwa": "Organizacja projektu",
   "etap": 1,
   "tn": [
    "T03",
    "T04"
   ],
   "tu": [],
   "przed": "Przekaż kartę projektu i mapę interesariuszy.",
   "po": "Karta projektu zaakceptowana przez sponsora, macierz odpowiedzialności, zasady pracy zespołu oraz podział prac (WBS) w planie projektu."
  },
  {
   "kod": "D03",
   "nazwa": "Planowanie",
   "etap": 2,
   "tn": [
    "T12",
    "T05"
   ],
   "tu": [
    "T01",
    "T04"
   ],
   "przed": "Przekaż macierz odpowiedzialności i WBS.",
   "po": "Plan diagnozy, ramowy plan projektu z kamieniami KM1–KM4 i rejestr ryzyk przedstawione sponsorowi do zatwierdzenia."
  },
  {
   "kod": "D04",
   "nazwa": "Start realizacji",
   "etap": 2,
   "tn": [
    "T06"
   ],
   "tu": [
    "T12",
    "T02",
    "T04"
   ],
   "przed": "Przekaż zatwierdzony plan diagnozy, ramowy plan projektu i uwagi sponsora.",
   "po": "Stały termin spotkań zespołu, notatki z ustaleniami i rozpoczęte zbieranie danych o stanie obecnym."
  },
  {
   "kod": "D05",
   "nazwa": "Lider projektu I",
   "etap": 2,
   "tn": [],
   "tu": [
    "T03",
    "T06"
   ],
   "przed": "Przygotuj przykłady z projektu: zadania opóźnione, ustalenia niewykonane, sytuacje trudne w zespole.",
   "po": "Rozliczenie zadań zespołu i zaktualizowana macierz odpowiedzialności."
  },
  {
   "kod": "D06",
   "nazwa": "Monitorowanie",
   "etap": 2,
   "tn": [
    "T07"
   ],
   "tu": [
    "T12",
    "T01",
    "T04"
   ],
   "przed": "Przekaż notatki ze spotkań zespołu, aktualny harmonogram i wyniki diagnozy stanu obecnego.",
   "po": "Raport statusu projektu z wynikami diagnozy i zaktualizowana wartość projektu w karcie."
  },
  {
   "kod": "D07",
   "nazwa": "Ryzyko w realizacji",
   "etap": 3,
   "tn": [
    "T13"
   ],
   "tu": [
    "T04",
    "T05",
    "T07"
   ],
   "przed": "Przekaż raport statusu, rejestr ryzyk i opis rozważanych wariantów rozwiązania.",
   "po": "Pełny plan projektu, zaktualizowany rejestr ryzyk, rejestr problemów i porównanie wariantów rozwiązania."
  },
  {
   "kod": "D08",
   "nazwa": "Zmiany w projekcie",
   "etap": 3,
   "tn": [
    "T08"
   ],
   "tu": [
    "T13",
    "T07"
   ],
   "przed": "Przekaż porównanie wariantów rozwiązania i zgłoszone propozycje zmian.",
   "po": "Rejestr decyzji i zmian z decyzją o wyborze wariantu."
  },
  {
   "kod": "D09",
   "nazwa": "Lider projektu II",
   "etap": 4,
   "tn": [],
   "tu": [
    "T02",
    "T07"
   ],
   "przed": "Przekaż mapę interesariuszy i opisz sytuacje sporne w projekcie.",
   "po": "Zaktualizowana mapa interesariuszy z działaniami wobec oporu."
  },
  {
   "kod": "D10",
   "nazwa": "Sterowanie i przygotowanie wdrożenia",
   "etap": 4,
   "tn": [
    "T09",
    "T10"
   ],
   "tu": [
    "T04",
    "T07"
   ],
   "przed": "Przekaż raport statusu i aktualne rejestry projektu.",
   "po": "Raport dla sponsora, plan pilotażu w dokumencie zamknięcia i uruchomiony pilotaż."
  },
  {
   "kod": "D11",
   "nazwa": "Wdrożenie i odbiór",
   "etap": 5,
   "tn": [
    "T14"
   ],
   "tu": [
    "T10"
   ],
   "przed": "Przekaż pierwsze wyniki pilotażu i kryteria odbioru z planu projektu.",
   "po": "Dokument zamknięcia prac projektowych z planem dalszego wdrożenia i planem pomiaru korzyści."
  },
  {
   "kod": "D12",
   "nazwa": "Wnioski i standard",
   "etap": 5,
   "tn": [
    "T11"
   ],
   "tu": [
    "T10"
   ],
   "przed": "Przekaż dokument zamknięcia prac projektowych.",
   "po": "Lessons learned i prezentacja rezultatów projektu."
  },
  {
   "kod": "D13",
   "nazwa": "Finał",
   "etap": 5,
   "tn": [],
   "tu": [
    "T09",
    "T10",
    "T14"
   ],
   "przed": "Przygotuj prezentację rezultatów projektu.",
   "po": "Właściciel rozwiązania kontynuuje wdrożenie w Spółce i mierzy korzyści według planu pomiaru."
  }
 ],
 "toolkit": {
  "T01": {
   "n": "Karta projektu",
   "o": "Cel, rezultaty, kryteria sukcesu, zakres i granice, sponsor, warunki zakończenia.",
   "od": "D00",
   "ik": "dokument"
  },
  "T02": {
   "n": "Mapa interesariuszy ze sposobem zaangażowania",
   "o": "Kto ma wpływ i interes w projekcie; kogo zespół pyta, kogo informuje, kto współdecyduje.",
   "od": "D01",
   "ik": "siec-relacji"
  },
  "T03": {
   "n": "Macierz odpowiedzialności",
   "o": "Kto wykonuje, kto zatwierdza, kogo się konsultuje i kogo informuje przy każdym zadaniu.",
   "od": "D02",
   "ik": "macierz"
  },
  "T04": {
   "n": "Plan projektu",
   "o": "Podział prac (WBS), harmonogram, kamienie milowe, zasoby, budżet, zaangażowanie pracowników.",
   "od": "D02",
   "ik": "termin"
  },
  "T05": {
   "n": "Rejestr ryzyk i rejestr problemów",
   "o": "Ryzyka z oceną prawdopodobieństwa i wpływu, reakcje, właściciele; problemy, które już wystąpiły.",
   "od": "D03",
   "ik": "ryzyko"
  },
  "T06": {
   "n": "Standard prowadzenia spotkań projektowych",
   "o": "Przygotowanie spotkania, zapis ustaleń, kontrola wykonania zadań.",
   "od": "D04",
   "ik": "spotkanie"
  },
  "T07": {
   "n": "Raport statusu projektu",
   "o": "Postęp względem planu, odchylenia i ich przyczyny, stan kamieni milowych.",
   "od": "D06",
   "ik": "wykres-slupkowy"
  },
  "T08": {
   "n": "Rejestr decyzji i zmian",
   "o": "Decyzje projektowe i zmiany z analizą wpływu na zakres, czas i budżet.",
   "od": "D08",
   "ik": "decyzja"
  },
  "T09": {
   "n": "Raport dla sponsora lub Zarządu",
   "o": "Stan projektu, sprawy do decyzji, eskalowane problemy.",
   "od": "D10",
   "ik": "raport"
  },
  "T10": {
   "n": "Dokument zamknięcia projektu z planem wdrożenia",
   "o": "Odbiór rezultatu, ocena osiągnięcia celu, plan pilotażu i dalszego wdrożenia, właściciel wdrożenia.",
   "od": "D10",
   "ik": "checklista"
  },
  "T11": {
   "n": "Lessons learned",
   "o": "Wnioski z przebiegu projektu na kolejne projekty Spółki.",
   "od": "D12",
   "ik": "refleksja"
  },
  "T12": {
   "n": "Plan diagnozy i zbierania danych",
   "o": "Jakie dane zespół zbiera, z jakich źródeł, kto je zbiera i do kiedy; wynik diagnozy stanu obecnego.",
   "od": "D03",
   "ik": "notatka"
  },
  "T13": {
   "n": "Opis koncepcji i porównanie wariantów",
   "o": "Warianty rozwiązania porównane według uzgodnionych kryteriów, z oceną kosztu, korzyści i ryzyka.",
   "od": "D07",
   "ik": "kompromis"
  },
  "T14": {
   "n": "Plan pomiaru korzyści",
   "o": "Mierniki korzyści, sposób i terminy pomiaru po wdrożeniu, właściciel pomiaru.",
   "od": "D11",
   "ik": "pomiar"
  }
 },
 "zespoly": {
  "P1": {
   "projekt": "Gospodarka środkami trwałymi",
   "sponsor": "Konrad Gieżek",
   "czlonkowie": [
    {
     "imie": "Hanna Bartkowska",
     "rola": "kierownik projektu (PM)"
    },
    {
     "imie": "Marta Gębka",
     "rola": "uczestnik procesu"
    },
    {
     "imie": "Katarzyna Płóciennik",
     "rola": "właściciel procesu"
    }
   ],
   "lider": "Hanna Bartkowska"
  },
  "P2": {
   "projekt": "PTBS Asystent – inteligentne wsparcie obsługi korespondencji",
   "sponsor": "Konrad Gieżek",
   "czlonkowie": [
    {
     "imie": "Piotr Szymański",
     "rola": "kierownik projektu (PM)"
    },
    {
     "imie": "Joanna Czub",
     "rola": "wsparcie"
    },
    {
     "imie": "Natalia Tietz",
     "rola": "właściciel procesu"
    }
   ],
   "lider": "Piotr Szymański"
  },
  "P3": {
   "projekt": "Optymalizacja procesu zamówień",
   "sponsor": "Konrad Gieżek",
   "czlonkowie": [
    {
     "imie": "Michał Gadziński",
     "rola": "kierownik projektu (PM)"
    },
    {
     "imie": "Krzysztof Bogusiewicz",
     "rola": "właściciel procesu"
    },
    {
     "imie": "Marcin Zawierta",
     "rola": "uczestnik procesu"
    }
   ],
   "lider": "Michał Gadziński"
  }
 }
};
