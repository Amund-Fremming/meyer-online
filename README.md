### Må ordnes
- (bildeopplastning ved username)???
- (Finn måte å avslutte spillet)
- Lage tutorial komponent, avsnitt med grafisk figur (kvist) || video

### Neste
- Bust knappen skal ikke være synlig om spiller før hadde terninger 00
- Oppdatere gamestate i Playerturn så man ikke blir kastet til start i sin tur om man refresher siden
- Fullføre spillere i GameBoard.jsx

- Sette timer til lavere verdi
- Varsle spillere hvem som ble busted eller tapte, spesielt spilleren før må få stor varsling => Ny atributt i databasen med spillers resultat??

- Lage Dices component som viser terningene som kan velges
- Fikse så det ikke har noe å si hvilken rekkefølge man skriver inn inputDices i så man ikke blir busted for feil rekkefølge.

- (Regne ut antall slurker, ut ifra hvor feil man busta?)
- beta testing med noen få brukere, så fikse feil

<br/><br/>

# Meyer

### Kort om appen
- Multiplayer terningspill som er laget etter <a href="https://da.wikipedia.org/wiki/Meyer_(terningspil)">Mayer</a>
- Spillet er laget for å kunne spilles online.

### Hva har jeg lært
- Hvordan man mounter/unmounter funksjoner og begrenser reads for å ikke få ekstremt mange kall til databasen der man ønsker real-time oppdateringer.
- Lært litt om å debouce funksjoner
- Fikse data consistency med firebase der man har race conditions
- Håndtere flere brukere som interakter med hverandre samtidig real-time
- Håndtering av lyttere, og hvordan disse kan skape problemer om de ikke blir unmounted.
- Hvordan hente data mer effektivt, så programmet blir raskere for brukeren.
- Gjenbruk av kode.

### Hva skal jeg gjøre annerledes neste gang
- Lage de fleste kallene til databasen først og så sende referansen videre til andre komponenter, kontra å hente ut referansen i hvert komponent. Blir mer effektivt program.
- Bli bedre på å skrive kommentarer og dokumentasjon.
- Ha kundemøter for å gjøre appen mer brukervennlig.
- Designe appens flow før man starter å lage, enklere å dele opp komponenter å se hva man faktisk trenger.

<br />

### How to use commandShortcuts.sh
list all commands
```
sh commandShortcuts help
```
Push to git, create a build and deploy to firebase, this requires that you have initialized your firebase project first.
```
sh commandShortcuts <commit msg> prod
```