### Må ordnes
- (bildeopplastning ved username)???
- (Finn måte å avslutte spillet)
- Lage tutorial komponent, avsnitt med grafisk figur (kvist) || video

### Neste
- Lage metode for sjekk av om man slo personen før med terning verdi før neste spiller oppateres
- Varsle spillere hvem som ble busted eller tapte, spesielt spilleren før må få stor varsling
- Lage GameBoard komponent som viser spillere på bordet og hva de kastet sist tur
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

<br />

### How to use gitpush.sh
list all commands
```
sh gitpush.sh help
```
Push to git, create a build and deploy to firebase, this requires that you have initialized your firebase project first.
```
sh gitpush <commit msg> prod
```