
# Velkommen til FVV!
Click [here](#welcome-to-fvv) for details in english.

### Innhold

1. [Introduksjon](#introduksjon)
2. [Krav til bruk](#krav-til-bruk)
3. [Installasjon og Kjøring](#installasjon-og-kjøring)
4. [Bidrag](#bidrag)
5. [Lisens og Eierskap](#lisens-og-eierskap)

### Introduksjon
FVV er en web-applikasjon som har som mål å brukes i sammenheng med vedlikehold av norske veier og infrastruktur i Norge. Det er særlig fokus på registrering og enkel uthenting av informasjon om vegobjekter slik de er beskrevet i Nasjonal Vegdatabank [(NVDB)](https://www.vegvesen.no/Fag/Teknologi/Nasjonal+vegdatabank). For mer info om å samhandle med denne databasen anbefaler vi [vegvesenets api-dokumentasjon](https://api.vegdata.no/). For oversikt over forskjellige api-kall er [api-les](https://nvdbapilesv3.docs.apiary.io/#) og [api-skriv](https://apiskriv.docs.apiary.io/#) gode ressurser.

### Krav til bruk
Applikasjonen har ingen begrensninger i seg selv, men enkelte deler av vegvesents API er under strengere restriksjoner. En konsekvens av dette er at man kan ikke registrere eller opprette nye vegobjekter uten tilgang til de enkelte test-miljøene. Et alternativ er å bruke docker til å simulere en lokal ned-skalert versjon av NVDB (se [installasjon](#Installasjon) for instrukser om oppsett.

### Installasjon og Kjøring
Dersom du kun ønsker å teste ut funksjonalitet fra et brukerperspektiv finnes det to prototyper man kan bruke direkte: En [produksjonsversjon](https://calm-peak-29666.herokuapp.com) og en [utviklerversjon](https://fvv-dev.herokuapp.com) (NB: Design er utdatert, oppdatering planlegges). Hvis det er tilfelle er det eneste du trenger en moderne nettleser (Firefox, Google Chrome, Opera osv).

Under følger et steg-for-steg oppsett hvis du ønsker å kjøre applikasjonen lokalt (hvis du er dreven i nodejs og git kan du skumlese denne seksjonen):

1. Installer følgende:
	1.  [Node js](https://nodejs.org)
	2.  [Docker bilde](https://hub.docker.com/r/nvdbapnevegdata/nvdb-api-skriv) dersom du ønsker å teste skriving av objekter

2. Last ned kodebasen. Dette kan gjøres på 2 måter:
	1.  Direkte i nettleser ved å [trykke her](https://github.com/xorfindude/fvv/archive/master.zip)
	2.  Åpne et terminalvindu (f.eks CMD for windows, BASH for linux eller Terminal for macOS) og kjøre
	     ``git clone https://github.com/xorfindude/fvv``
	     (husk å navigere til ønsket sted for utpakking dersom du bruker ``git clone``).

3. Åpne et terminalvindu (hvis du ikke allerede har gjort det) og naviger inn i mappen som ble pakket ut i forrige steg. Kjør ``npm install`` for å installere moduler som applikasjonen er avhengig av for å fungere.

4. Kjør ``npm run dev`` for å starte applikasjonen, den vil åpne seg i et nytt vindu i din standardnettleser.

### Bidrag
Alle som ønsker er svært velkomne til å bidra, eneste vi ber om er at pull-requests åpnes mot dev og ikke master. Dersom du har forslag til funksjonalitet eller ønsker å rapportere feil (bugs) så opprett gjerne et "issue" her på github-siden.

### Lisens og eierskap
FVV er lisensiert under [GNU GPL](https://www.gnu.org/licenses/gpl-3.0.en.html) og er sponset av [Norkart AS](https://www.norkart.no/om-oss/).


# Welcome to FVV!

### Contents
1. [Introduction](#introduction)
2. [Requirements](#requirements)
3. [Installing and Running](#installing-and-running)
4. [Contributing](#contributing)
5. [License and Ownership](#license-and-ownership)

### Introduction
FVV is a web-application that aims to be a useful tool for managing maintenance of roads and infrastructure in Norway. It is particularly focused on registering and simple extraction of data regarding road objects as they are described in [NRDB](https://www.vegvesen.no/en/professional/roads/national-road-database/). For more information on interacting with this database we recommend reading up on [the api-documentation](https://api.vegdata.no/) and the overviews of [reading](https://nvdbapilesv3.docs.apiary.io/#) and [writing](https://apiskriv.docs.apiary.io/#) (Ufortunately, these pages appear to be in Norwegian only so bring a translator).

### Requirements
The application has no inherent limitations, but certain parts of the API is under stricter access regulation. As a result it is not possible to register or create new road objects without permission to access the testing or production environments. An alternative is to use a docker image to simulate a local down-scaled version of NRDB. See the [installation](#installing-and-running)-section for more details.

### Installing and Running
If you only wish to test the functionality from a users perspective then there are two prototypes available:
The [production version](https://calm-peak-29666.herokuapp.com) and the [testing version](https://fvv-dev.herokuapp.com) (Note: Design is now outdated, updates are scheduled). Then all you need is a modern web browser (Firefox, Google Chrome, Opera etc).

Below follows a step-by-step setup if you wish to run the application locally (if you are familiar with nodejs and git you can probably skim through this part).


1. Install the following:
	1.  [Node js](https://nodejs.org)
	2.  [Docker Image](https://hub.docker.com/r/nvdbapnevegdata/nvdb-api-skriv) if you wish to test writing objects to a local environments. (Once again instructions are in Norwegian only).

2. Download the codebase. This can be done in two ways:
	1. Directly in your browser by [clicking here](https://github.com/xorfindude/fvv/archive/master.zip)
	2. Opening a console (i.e cmd for windows, bash for linux or terminal for macOS) and running
	     ``git clone https://github.com/xorfindude/fvv``
	     (remember to navigate to the desired folder location before you run ``git clone``).

3. Open a console (if you did not already) and navigate to the extracted/cloned folder. Once inside this folder, run ``npm install`` to install modules and dependencies.

4. Run ``npm run dev`` to start the application, which will open in a new tab in your standard web browser.

### Contributing
Anyone that wishes to are very welcome to contribute, we only ask that pull-requests are opened against dev and not master. If you have any suggestions or wish to report errors (bugs) then feel free to post an issue.

### License and Ownership
FVV is licensed under [GNU GPL](https://www.gnu.org/licenses/gpl-3.0.en.html) and is a project sponsored by [Norkart AS](https://www.norkart.no/norkart-in-english/#)
