# Sessionsanteckningar
_Senast uppdaterad: 

## Vad är gjort
- Lade till lokal auth-bypass via VITE_AUTH_BYPASS i appens route-guard.
- Satte VITE_AUTH_BYPASS=1 i .env.
- Startade om appen som dev-server på fast port 4173 (strictPort).
- Öppnade appen i browsern på localhost.

## Nuvarande status
Appen kör lokalt med aktiv bypass och ska släppa in utan vanlig login.

## Pågående uppgift
Verifiera att dashboard öppnas direkt utan inloggning.

## Nästa steg
- Bekräfta att du är inne i appen.
- När riktig login ska användas igen: sätt VITE_AUTH_BYPASS=0 och starta om servern.

## Kända problem
- Bypass är avsiktligt aktiv i lokal miljö tills den stängs av.
