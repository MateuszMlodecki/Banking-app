/* Adding create card
zrobimy sobie stepper

step1 (card type): 
- wybor rodzaju karty: 
{ debit: ['physical', 'virtual'], // formularz karty 
 credit: ['credit form'], //wniosek kredytowy, zeby zlozyc wniosek o karte
 kids: ['physical'] }//formularz karty
}
- formularz karty:
	step1: 
	- visa/master
	step2:
	- ustawianie pinu (pin, potwierdz pin)
	step3:
	- dane do wysylki karty (autouzupelnianie na podstrawie profilu + checkbox, ze potwierdzam prawdziwosc danych)* tylko dla physical
	step4: 
	- podsumowanie: wybrany rodzaj (physical/virtual), typ (visa/master), dane do wysylki (jesli sa), defaultowe limity ( w przypadku wybrania karty kids powinny byc mniejsze)
	- przycisk potwierdz -> wyslanie requestu
dev notes:
 - kazdy step powinien posiadac swoj oddzielny formularz i scheme
 - najlatwiej bedzie to owrappowac contextem
 - credit zrob tylko jako opcje, ale na razie nie dziala, nigdzie nie przekierowuje
*/

/*Manage Card (single)
Z poziomuy CardManagement mozemy wybrac sobie karte i przejsc do jej podgladu

Podglad karty:
- karta wyswietlana przy uzyciu komponnetu CreditCard, dane powinny byc zakropkowane z mozliwoscia odsloniecia po klknieciu przycisku
- przycisk edytuj limity otwiera nam modal/podstrone z formularzem do edytowania limitow (za pomoca sliderow lub inputow mozemy zmieniac limity: transakcje internetowe,
sklepowe, wyplaty z bankomatow)
- przycisk usun karte otwiera nam modal z potwierdzeniem usuniecia karty


*/
