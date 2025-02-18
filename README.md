# DCST2002_Prosjekt2024_Gruppe1

## Dette produktet er et samarbeidsprosjekt, skrevet og laget sammen med:

- kasduden
- ellenurdal
- Lundiez
- lizzarissa

Veiledning som beskriver hvordan man installerer, setter opp og bruker løsningen.


Om de ikke allerede eksisterer lag to konfigurasjonsfiler for databaseoppsettet.
Opprett filene i henhold til gitt sti og legg inn følgende:
`server/config.ts`:

```ts
process.env.MYSQL_HOST = 'mysql.stud.ntnu.no';
process.env.MYSQL_USER = 'ivarriv_Prosjekt2024';
process.env.MYSQL_PASSWORD = ''; // Spør om Passordet
process.env.MYSQL_DATABASE = 'ivarriv_Dummy';
```


`server/test/config.ts`:

```ts
process.env.MYSQL_HOST = 'mysql.stud.ntnu.no';
process.env.MYSQL_USER = 'ivarriv_Prosjekt2024';
process.env.MYSQL_PASSWORD = ''; // Spør om Passordet
process.env.MYSQL_DATABASE = 'ivarriv_Dummy_test';
```



## Start serveren:
    Innstaller avhengigheter og start serveren:

```sh
cd server
npm install
npm start
```


## Start klienten:
    Innstaller avhengigheter og start klienten:

```sh
cd client
npm install
npm start
```



## tester:
    Server tester:
```sh
cd server
npm test
```


    Klient tester:
```sh
cd client
npm test
```



## Innstallerte biblioteker og avgengigheter

Alle biblioteker og avhengigheter som er brukt skal innstalleres automatisk ved gjennomføring av stegende over. 

Om det skulle oppstå problemer ligger databaseoppsettet i Database.md
Biblioteker og avhengigheter ligger i package.json.

Eventuelt kan alle bibliotekene innstalleres separat slik:

client/package.json:
```sh
npm install axios react-icons react-router-dom-v5-compat react-simplified supertest todo-client@file: wiki-client@file: \
&& npm install --save-dev @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript @cfaester/enzyme-adapter-react-18 \
@testing-library/jest-dom @testing-library/react @types/enzyme @types/jest @types/react-dom @types/react-router-dom \
@types/supertest @types/testing-library__react @types/tinymce babel-jest babel-loader css-loader enzyme enzyme-to-json \
jest jest-environment-jsdom prettier style-loader typescript webpack webpack-cli

```

Server/package.json:
```sh
npm install axios dotenv express express-session passport passport-google-oauth20 supertest todo-server@file: wiki-server@file: \
&& npm install --save-dev @babel/core @babel/node @babel/preset-env @babel/preset-typescript @types/express \
@types/express-session @types/jest @types/passport @types/passport-google-oauth20 @types/react @types/supertest \
@types/tinymce babel-jest jest mysql2 nodemon prettier ts-jest typescript

```

Root:
```sh
npm install react-icons passport passport-google-oauth20 express-session dotenv \
&& npm install --save-dev css-loader style-loader @types/express-session @types/passport @types/passport-google-oauth20 @react-icons/all-files
```


# Annen feilsøking:

Ved testing av nedlastningen av prosjektet har følgende feilmelding oppstått:
[{
    "resource": "/c:/Users/ellen/OneDrive - NTNU/DIGSEC-EllenSU/DCST2002, Webutvikling/Prosjekt_test/DCST2002_Prosjekt2024_Gruppe1/server/config.ts",
    "owner": "typescript",
    "code": "2580",
    "severity": 8,
    "message": "Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.",
    "source": "ts",
    "startLineNumber": 4,
    "startColumn": 1,
    "endLineNumber": 4,
    "endColumn": 8
}]


Feilmeldingen har forsvunnet noen sekunder etter at 'npm install' er kjørt på både server og klient. Om den skulle vedvare sjekk at alle overstående biblioteker og avhengigheter er innstallert.
