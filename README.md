# Sfera Express Delivery

Ky projekt eshte nje web aplikacion i plote per `Sfera Express Delivery` dhe
`sferaexpress.al`, i ndertuar me `Next.js 16`, `React 19`, `TypeScript` dhe
`Tailwind CSS 4`.

## Cfare ben

- regjistrim dhe login per bizneset me email ose Gmail
- profil biznesi me emrin, qytetin, telefonin, email-in dhe adresen e sakte
- panel biznesi me ikone profili dhe buton plus ne qender poshte
- krijim dergese ne dy hapa me kosto automatike sipas qytetit
- tracking code unik per cdo dergese
- tracking live ne `/track/[code]`
- panel qendre operative ne `/center`
- tarifa te ndryshueshme per cdo qytet
- sinjale jeshile ose portokalli sipas volumit te porosive per destinacion
- telemetry API per lidhje me GPS ose me sistem te jashtem

## Qytetet operative

- Tirane
- Elbasan
- Lushnje
- Fier
- Vlore
- Durres
- Sarande

## Nisja lokale

```bash
pnpm install
pnpm dev
```

Pastaj hap `http://localhost:3000`.

## Komandat kryesore

```bash
pnpm dev
pnpm lint
pnpm build
pnpm start
```

## Kredencialet fillestare te qendres

Qendra operative seed-ohet automatikisht ne file store.

- email: `admin@sferaexpress.al`
- fjalekalim: `SferaAdmin2026!`

Per prodhim, ndryshoji me env vars:

- `SFERA_ADMIN_EMAIL`
- `SFERA_ADMIN_PASSWORD`
- `SFERA_TELEMETRY_KEY`

## Telemetry API

`POST /api/telemetry`

Header:

- `x-sfera-api-key: local-sfera-telemetry-key`

Body shembull:

```json
{
  "trackingCode": "SFE-TIR-AB12CD",
  "status": "Ne tranzit",
  "location": "Afer autostrades Tirane - Durres",
  "lat": 41.2902,
  "lng": 19.6321,
  "note": "Pakoja eshte ne makinen e shperndarjes"
}
```

## Ruajtja e te dhenave

Te dhenat ruhen lokalisht ne:

- `data/sfera-express-store.json`

Ky file krijohet automatikisht ne kerkesen e pare runtime. Ky eshte nje store
lokal per MVP. Per prodhim, hapi tjeter i arsyeshem eshte kalimi ne PostgreSQL
ose Supabase.

## Rruget kryesore

- `/`: landing page me motor kerkimi per tracking
- `/auth`: regjistrim dhe login
- `/portal`: paneli i biznesit
- `/portal/profile`: profili i biznesit
- `/portal/create`: krijimi i dergeses
- `/center`: paneli i qendres operative
- `/track/[code]`: ndjekja e produktit
- `/api/status`: status publik i sistemit
- `/api/shipments`: krijimi i dergeses nga portali
- `/api/tracking/[code]`: tracking JSON
- `/api/telemetry`: perditesime GPS ose operative
