🐈 StreetCats

1-AVVIO DEL BACKEND
Aprire powershell nella cartella del backend e digitare:
node server.js

2-AVVIO DEL FRONTEND
Dopo il passo 1, avviare dalla cartella del frontend digitando:
npm install   (Solo la prima volta per scaricare le dipendenze) e poi
npm run dev

L'app sarà disponibile su http://localhost:5173.

3-TEST END TO END
Assicurarsi che backend e frontend siano avviati e digitare dalla cartella del frontend:
npx playwright test
