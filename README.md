# ZAVRŠNI RAD

Projekt full-stack edukacijska platforma s backendom u Node.js + SQLite i frontendom u React + Vite + Tailwind CSS. Projekt je organiziran u dva odvojena foldera – jedan za server (Node.js backend s Express API-jem i SQLite bazom) i drugi za client (React frontend s Viteom i Tailwindom). Za lokalno pokretanje potrebno je otvoriti dva terminala: u jednom se pokreće backend server (naredbom `npm run dev` u server folderu), a u drugom se pokreće frontend aplikacija (naredbom `npm run dev` u client folderu). Frontend se tada povezuje na backend API i omogućuje funkcionalnosti registracije, login-a, prikaza lekcija, rješavanja vježbi i automatskog pokretanja studentskog C koda unutar Docker sandboxa za sigurno izvršavanje.


---

## Tehnologije

- **Backend:** Node.js, Express, SQLite
- **Frontend:** React, Vite, Tailwind CSS
- **Sandbox:** Docker + gcc image

---

## Preduvjeti

[Node.js](https://nodejs.org/) (v18+)  
[Docker Desktop](https://www.docker.com/products/docker-desktop/) ili Docker Engine (obavezno za sandbox pokretanje korisnikovog koda unutar editora aplikacije)

---

## Upute za pokretanje lokalno

### 1. Klonirati repozitorij

```bash
git clone https://github.com/mislav369/zavrsni-rad.git
cd zavrsni-rad
```

### 2. Instalirati ovisnosti za backend

```bash
cd server
npm install
```

### 3. Instalirati ovisnosti za frontend

```bash
cd ../client
npm install
```

### 4. Pokreniti Docker Desktop

Potrebno za sandbox pokretanje korisnikovog koda.

### 5. Pokreni backend server

```bash
cd ../server
npm run dev
```

Server se pokreće na **http://localhost:5000**

### 6. Pokreniti frontend React app

U novom terminalu:

```bash
cd client
npm run dev
```

Frontend se pokreće na **http://localhost:5173**

---


## Seed podaci

Seed podaci se automatski unose prilikom prvog pokretanja servera ako baza ne postoji.

---

## Napomene

- Za funkcionalnost **“Provjeri rješenje”** mora biti pokrenut Docker i preuzet gcc image:

  ```bash
  docker pull gcc:11
  ```

- Ako se želi resetirati bazu, samo obrisati SQLite file i ponovno pokreni server.

---


## Autor

**Mislav [mislav369](https://github.com/mislav369)**
