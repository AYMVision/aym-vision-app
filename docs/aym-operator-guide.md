# AYM Vision — Operator-Handbuch

Dieses Handbuch richtet sich an dich als Betreiberin der AYM Vision App.
Es beschreibt jeden Account, jeden Konfigurationswert und jeden manuellen Schritt,
den du einmalig einrichten musst, damit das System produktionsbereit ist.

---

## ⚠️ Offene Aufgaben — hier musst du noch aktiv werden

Hake diese Punkte ab, bevor du live gehst:

- [ ] Stripe-Account anlegen und verifizieren (Schritt 1)
- [ ] Stripe-Produkt + Payment Link pro Episode anlegen (Schritt 1)
- [ ] Stripe Restricted API Key erstellen (Schritt 1)
- [ ] Privates GitHub-Inhalts-Repository anlegen (Schritt 2)
- [ ] GitHub Fine-Grained PAT erstellen (Schritt 2)
- [ ] **Story-Inhalte aus dem öffentlichen PWA-Repo in das private Content-Repo migrieren (Schritt 2 — kritisch für Kopierschutz!)** *(D6 im Implementierungsplan)*
- [ ] Cardano Master-Wallet offline generieren (Schritt 3)
- [ ] Master Wallet auf Preprod faucen (Staging) / mit echtem ADA laden (Produktion) (Schritt 3)
- [ ] Master Public Key ableiten und in Backend-Config eintragen (Schritt 3)
- [ ] UVerify-Instanz wählen (selbst-gehostet oder app.uverify.io) und einrichten (Schritt 4)
- [ ] `aymProfile`- und `aymAnchor`-Templates bei UVerify registrieren (Schritt 4) *(Phase C noch nicht fertig)*
- [ ] Finale Hosting-URLs für App und Backend festlegen (Schritt 5)
- [ ] Alle Env-Variablen auf dem Server setzen (Konfigurationsreferenz)

---

## Teil 1 — Accounts & manuelle Schritte

### Schritt 1: Stripe

**Was:** Stripe wickelt die In-App-Käufe (Episoden-Freischaltung per Kreditkarte) ab.

1. **⚠️ HUMAN STEP** — Geh auf <https://dashboard.stripe.com> und eröffne ein Konto.
   Fülle Geschäftsdaten und Auszahlungskonto aus. Stripe braucht einige Tage zur Verifizierung.

2. **Pro kaufbarer Episode** (z. B. `s1e01`, `s1e02` …):
   - Erstelle ein **Produkt** (Name: z. B. "AYM Vision – Episode 1").
   - Füge einen **Preis** hinzu (einmalig, in EUR).
   - Erstelle einen **Payment Link** für diesen Preis.
     - Success-URL muss exakt so lauten:
       ```
       https://<deine-app-domain>/shop/return?session_id={CHECKOUT_SESSION_ID}
       ```
       *(Das `{CHECKOUT_SESSION_ID}` lässt du genau so stehen — Stripe ersetzt es automatisch.)*
   - Notiere die **Payment Link URL** (Format: `https://buy.stripe.com/...`).
     Sie kommt später in `VITE_STRIPE_LINK_BASE`.

3. **⚠️ HUMAN STEP** — Erstelle einen **Restricted API Key**:
   - Dashboard → Developers → API keys → Create restricted key
   - Berechtigung: **Checkout Sessions – Read** (sonst nichts)
   - Diesen Key notieren → kommt in `AYM_STRIPE_API_KEY` auf dem Backend-Server.
   - **Niemals den vollen Secret Key verwenden.**

---

### Schritt 2: GitHub Inhalts-Repository

**Was:** Das Backend lädt Kurs-Bundles (`/{episodenId}/bundle.json`) aus einem privaten GitHub-Repo.

1. **⚠️ HUMAN STEP** — Erstelle ein **privates GitHub-Repository** (z. B. `aym-vision-content`).
   Lege die Kurs-Bundles dort ab:
   ```
   s1e01/bundle.json
   s1e02/bundle.json
   …
   ```
   Format von `bundle.json`:
   ```json
   { "version": "1.0.0", "payload": "<base64-codierter Inhalt>" }
   ```

2. **⚠️ HUMAN STEP** — Erstelle einen **Fine-Grained Personal Access Token**:
   - GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens
   - Repository-Zugriff: **nur** das Inhalts-Repo
   - Berechtigung: **Contents – Read-only**
   - Ablaufdatum setzen (z. B. 1 Jahr) und **Rotation vormerken**:
     - Rotation = neuen Token erstellen, alten im Backend-Secret ersetzen, Backend neu starten.
     - Downtime: keine — der Cache läuft weiter bis der neue Token aktiv ist.
   - Token notieren → kommt in `AYM_CONTENT_REPO_TOKEN`.

3. Die Basis-URL des Repos für den Backend-Zugriff hat dieses Format:
   ```
   https://raw.githubusercontent.com/<dein-github-user>/aym-vision-content/main
   ```
   → kommt in `AYM_CONTENT_REPO_URL`.

4. **⚠️ HUMAN STEP — Story-Inhalte aus dem öffentlichen PWA-Repo migrieren (kritisch!)**

   Aktuell liegen alle Episode-Inhalte als TypeScript-Dateien **im öffentlichen Repo** der PWA:
   ```
   src/story-v02/content/de/s1e01.de.ts  ← öffentlich lesbar!
   src/story-v02/content/de/s1e02.de.ts
   src/story-v02/content/en/s1e01.en.ts
   … (alle Episoden)
   ```
   Das bedeutet: jeder kann die Inhalte lesen, ohne zu zahlen.

   **Was muss passieren (Task D6 im Plan):**
   - Die Inhalte werden als `bundle.json`-Dateien ins **private** Repo konvertiert und geladen
   - Danach werden die `.ts`-Dateien aus dem öffentlichen Repo **gelöscht**
   - Erst dann greift der Kopierschutz wirklich

   Format pro Episode im privaten Repo:
   ```
   s1e01/bundle.json   ← enthält den serialisierten Episoden-Inhalt
   s1e02/bundle.json
   …
   ```
   Diese Migration erfolgt im Rahmen von **Task D6** (Implementierungsplan)
   und erfordert Abstimmung mit dem Entwickler.

---

### Schritt 3: Cardano Master-Wallet

**Was:** Eine einzige Cardano-Wallet erfüllt zwei Rollen:
- **Handshake-Schlüssel** — nur der Inhaber dieser Wallet darf Voucher erstellen (Admin-CLI).
- **Anchor-Wallet** — signiert alle 48 h die Blockchain-Verankerung der Nutzerdaten.

1. **⚠️ HUMAN STEP** — Generiere **offline** (ohne Internetverbindung) ein 24-Wort-Mnemonic:
   - Empfohlen: [Daedalus](https://daedaluswallet.io/) im Offline-Modus, oder ein Hardware-Wallet (Ledger/Trezor mit Cardano-Support).
   - Schreibe die 24 Wörter auf Papier und bewahre sie in einem Passwort-Manager auf.
   - **Niemals in Git einchecken. Niemals in einer Datei auf dem Server speichern.**

2. **⚠️ HUMAN STEP** — Leite den Master Public Key ab (einmalig, im Terminal):
   ```bash
   # Im aym-vision-app Verzeichnis:
   AYM_MASTER_MNEMONIC="wort1 wort2 ... wort24" \
     npx tsx -e "
   import { restoreIdentity } from './src/identity/keys.ts';
   const id = await restoreIdentity(process.env.AYM_MASTER_MNEMONIC);
   console.log('Master Public Key:', id.publicKeyHex);
   "
   ```
   Den ausgegebenen Hex-String (64 Zeichen) → kommt in `AYM_MASTER_PUBLIC_KEY`.

3. **⚠️ HUMAN STEP** — Wallet mit ADA laden:
   - **Staging (Preprod):** kostenloses Testnet-ADA vom [Cardano Testnetz Faucet](https://docs.cardano.org/cardano-testnets/tools/faucet/)
   - **Produktion (Mainnet):** echtes ADA — Richtwert: eine Anchor-Transaktion alle 48 h kostet ca. 0,15–0,20 ADA. Für ein Jahr ca. 25–30 ADA einplanen.

---

### Schritt 4: UVerify

**Was:** UVerify stellt die Zertifikate aus und verankert den MPF-Root auf der Blockchain.

**Option A — Selbst gehostet** (du betreibst UVerify auf eigenem Server):
- Das AYM-Backend läuft als Extension direkt im UVerify-Prozess.
- Kein separater Schritt nötig — alles läuft auf deinem Server.

**Option B — app.uverify.io** (UVerify als Dienst):
- **⚠️ HUMAN STEP** — Bootstrap Datum anfordern:
  Schreib an hello@uverify.io oder melde dich im UVerify Discord.
  Erkläre, dass du die AYM Vision Extension mit White-Label-Batching nutzen möchtest.

**Templates registrieren** *(Phase C ist noch nicht fertig — dieser Schritt kommt später)*:
- Sandbox: `uv run sandbox.py template add AymProfile && uv run sandbox.py restart`
- Produktion: Pull Request in `UVerify-io/uverify-ui` → `additional-templates.json`

---

### Schritt 5: Hosting & Domains

**⚠️ HUMAN STEP** — Lege finale URLs für App und Backend fest und trage sie überall ein:

| Was | Wo eintragen |
|---|---|
| App-URL (z. B. `https://app.aym.vision`) | `AYM_UI_BASE_URL`, Stripe Success-URL, CORS-Config |
| Backend-URL (z. B. `https://api.aym.vision`) | `VITE_AYM_BACKEND_URL` im App-Build |

CORS im Backend (`.env` oder Serverconfig):
```
CORS_ALLOWED_ORIGINS=https://app.aym.vision
```

---

## Teil 2 — Konfigurationsreferenz

### Backend-Server (`.env` Datei auf dem Server)

| Env-Variable | Geheim | Standard | Bedeutung |
|---|---|---|---|
| `AYM_MASTER_PUBLIC_KEY` | nein | — | Ed25519 Public Key der Master-Wallet (64 Hex-Zeichen), abgeleitet in Schritt 3 |
| `AYM_ANCHOR_WALLET_MNEMONIC` | **ja** | — | 24-Wort-Mnemonic der Master-Wallet (Schritt 3) — nur via Secret Store injizieren |
| `AYM_ANCHOR_INTERVAL_MS` | nein | `172800000` | Verankerungs-Intervall in Millisekunden (Standard: 48 h) |
| `AYM_STRIPE_API_KEY` | **ja** | — | Stripe Restricted Key (Schritt 1) |
| `AYM_STRIPE_PRODUCTS_S1E01` | nein | — | Stripe Produkt-ID → `s1e01` (ein Eintrag pro Episode) |
| `AYM_CONTENT_REPO_URL` | nein | — | Basis-URL des privaten GitHub-Repos (Schritt 2) |
| `AYM_CONTENT_REPO_TOKEN` | **ja** | — | GitHub Fine-Grained PAT (Schritt 2) |
| `AYM_CONTENT_REPO_CACHE_TTL` | nein | `PT6H` | Cache-Dauer für Kurs-Bundles (ISO-8601, z. B. `PT6H` = 6 Stunden) |
| `AYM_MPF_DB_PATH` | nein | `./data/mpf` | Pfad zur RocksDB — muss auf einem **persistenten Volume** liegen (kein tmpfs!) |
| `AYM_UI_BASE_URL` | nein | — | Basis-URL der App (z. B. `https://app.aym.vision`) für Zertifikats-Links |

### App-Build (`.env` beim Bauen der App)

| Env-Variable | Geheim | Bedeutung |
|---|---|---|
| `VITE_AYM_BACKEND_URL` | nein | URL des Backends, z. B. `https://api.aym.vision` |
| `VITE_STRIPE_LINK_BASE` | nein | JSON-Map: ContentId → Stripe Payment Link URL, z. B. `{"s1e01":"https://buy.stripe.com/...","s1e02":"https://buy.stripe.com/..."}` |
| `VITE_SKIP_BACKUP_GATE` | nein | `true` **nur** in Demo-Builds (z. B. Tommi-Einreichung) — **niemals** in Produktions- oder App-Store-Builds setzen |
| `VITE_APP_VERSION` | nein | App-Version (optional, für Anzeige im Profil) |

### Admin-CLI (Terminal, wenn Voucher erstellt werden)

| Env-Variable | Geheim | Bedeutung |
|---|---|---|
| `AYM_MASTER_MNEMONIC` | **ja** | 24-Wort-Mnemonic der Master-Wallet — **nur als Env-Variable, niemals als Datei** |
| `AYM_BACKEND_URL` | nein | URL des Backends |
| `AYM_APP_URL` | nein | URL der App (für Redeem-Links im QR-Code) |

---

## Teil 3 — Verifizierungs-Walkthrough (Sandbox)

Dieser Walkthrough testet das komplette System einmal durch, bevor du live gehst.
**Voraussetzung:** Backend läuft lokal auf Port 9090 (Preprod-Modus).

### 1. Sandbox starten

```bash
# Im uverify-examples Verzeichnis (beim UVerify-Entwickler):
uv run sandbox.py start
```

### 2. Backend starten

```bash
# Im uverify-backend Verzeichnis:
./mvnw spring-boot:run
```
Swagger-UI erreichbar unter: <http://localhost:9090/swagger-ui.html>

### 3. App starten

```bash
# Im aym-vision-app Verzeichnis:
VITE_AYM_BACKEND_URL=http://localhost:9090 npm run dev
```

### 4. Voucher erstellen (Admin-CLI)

```bash
cd /pfad/zu/aym-vision-app

AYM_MASTER_MNEMONIC="deine 24 wörter ..." \
AYM_BACKEND_URL="http://localhost:9090"     \
AYM_APP_URL="http://localhost:5173"         \
npx tsx tools/aym-admin/create-vouchers.ts --content s1e01 --count 3 --out ./test-vouchers
```

Ergebnis: `./test-vouchers/vouchers-s1e01.csv` + 3 QR-PNGs.

### 5. Voucher einlösen

- Öffne die App im Browser (<http://localhost:5173>)
- Gehe zu **Einlösen** (Eltern-Bereich → Voucher einlösen)
- Gib einen der UUIDs aus der CSV ein (oder scanne den QR-Code)
- Bestätige → Episode wird freigeschaltet

Erwartetes Ergebnis: Erfolgsmeldung, Episode erscheint als freigeschaltet, Backup-Prompt erscheint.

### 6. Profil-Seite prüfen

- Gehe in der App zu **Profil**
- Die Blockchain-Karte sollte sichtbar sein mit dem Hinweis "Verankerung ausstehend"

### 7. Anchor-Verankerung ⚠️ ausstehend (B5/B6 noch nicht implementiert)

Dieser Schritt ist noch nicht verfügbar. Sobald B5 (MPF-Service) und B6 (Anchor-Scheduler)
implementiert sind:

```bash
# Anchor manuell auslösen (Entwickler-Endpunkt):
curl -X POST http://localhost:9090/api/v1/aym/anchor/trigger
```

Danach auf der Profil-Seite: Status wechselt zu "✓ Auf der Blockchain gesichert".

### 8. Zertifikats-Link öffnen ⚠️ ausstehend (Phase C noch nicht implementiert)

Sobald das `aymProfile`-Template fertig und bei UVerify registriert ist:
- Der Zertifikats-Link (Format: `https://app.uverify.io/verify/<hash>?pk=...`) öffnet
  eine öffentliche Profilseite mit allen freigeschalteten Episoden.

---

*Stand: 2026-08-12 — wird mit jeder neuen Phase erweitert.*
