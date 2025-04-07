Praca domowa 13.01

1.  Zrobic formularz w register

           Stworz formularz z walidacja

    - name => required, min 2 znaki, max 15 znakow.
    - lastName => required, min 2 znaki, max 25 znakow
    - age => required, min 18 lat
    - email => required, \* sprobuj napisac regExp do testowania poprawnosci email
    - password => required
    - repeatPassword => required, sprawdz, zeby bylo takie samo jak password
    - city => optional, max 40 znakow

    po kliknieciu submit buttona console.log z wartosciami

2.  Zrobic formularz do logowania

---

- obydwie strony powinny byc oddzielne i podpiete w Routerze
- dobrze bedzie jak uzyjesz MUI

---

dodatkowo:

- przeczytaj/obejrzyj o react-hook-form

---

kolejna lekcja:

- react-hook-form
- axios + jwt/autentykacja
- node i express

Praca domowa 20.01

1. Przerob Register na react-hook-form

2. Napisać testy jednostkowe (unit test dla login i register)
   test suites:

   - should render component
   - should show error when <nazwa_pola> is wrong (dla kazdego z pol)

   sprawdzic czym są cornercase

Praca domowa 27.01

Napisac UserDetails w oparciu o Stepper (Mui stepper);

Na czym to ma polegac:

- kazdy step to oddzielny komponent, z oddzielnym formularzem i oddzielna walidacja
- na onSubmit przekazujesz dane do contextu (celem tego, zeby byly dostepne w kolejnym stepie)

stepy:

1. personal details
2. address info
3. bank details
4. podsumowanie (tu wyswietl wprowadzone wczesniej dane)

Co jest istotne:

- przekierowania miedzy stepami powinny byc oparte na conditional renderingu, a nie przekierowaniach z refreshem! (lub w inny sposob, ale bez refreshu)

  Formatowanie JSON'a
  https://stackoverflow.com/questions/4810841/pretty-print-json-using-javascript

Praca domowa 03.02.2025

1. Poprawic sugestie po review
2. Zrobic theme (instrukcja w theme.ts)
   - ostyluj ladnie stepper (mozesz sobie poszukac na dribbble.com)
3. Zrob layouty
   - AuthLayout (https://dribbble.com/shots/24552589-Login-Sign-up-Dark-Mode-UI-UX-Design)
   - MainLayout (po zalogowaniu, powinien miec drawer z lewej strony; https://mui.com/material-ui/react-drawer/?srsltid=AfmBOoqRp53R2WPbassnvOkCQmUspX3wrJNBQtXuzJ9SLn_sMVvMDKZq)
4. - Zrobic dark i light theme (razem ze switchem itp) https://mui.com/material-ui/customization/dark-mode/?srsltid=AfmBOopcOLMaLZwry08ZnXQdF1IVMo7E7Dr_sH4_99mhqPASlSUfnQVs
   * ZROB NA ODDZIELNYM BRANCHU

na kolejnej lekcji:

- axios + jwt/autentykacja
- node i express

Praca domowa 10.03

1. Poprawic PR
2. Przeronic fetch na axios
3. Zaczac ekran platnosci
   - ekran wysylania przelewu jakw mBank
   - najpierw basic front
   - potem basic backend
   - udoskonalenie walidacji
   - udoskonalenie funkcjonalnosci

Praca domowa 27.03

1. Poprawic przekierowania z user na user/:id
2. Napisz AlertContext
   - context dla calej apki, ktory w prosty sposob pozwoli nam wyswietlac info/success i error message
   - mozesz uzyc Alert z MUI albo skorzystac z innej biblioteki
   - do tworzenia message w Alertach uzyj errorHandlera
     w efekcie obsluga bledow powinna wygladac mniej wiecej tak:
     const {setErrorAlert, setSuccessAlert lub setAlert} = useAlertContext()
     .catch(err=> {
     setErrorAlert(err)
     setAlert('error', err)
     })
     to powinno wystarczyc, zebys w kazdym miejscu aplikacji (komponencie) mogl obsluzyc w ten sam sposob bledy
