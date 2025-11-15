# 📘 README – Proiect Aplicatie Full-Stack (React + Node + Sequelize)

## 1. Descriere generala

Acest proiect reprezinta o aplicatie full-stack formata din doua componente principale:

* **Frontend** realizat in **React**, stilizat cu **TailwindCSS**, responsabil pentru interfata utilizator.
* **Backend** realizat in **Node.js (Express)**, cu **Sequelize ORM** pentru interactiunea cu baza de date.

Scopul aplicatiei este de a demonstra integrarea dintre un frontend si un backend REST, gestionarea datelor, validari, comunicarea prin API-uri si organizarea corecta a unui proiect web.

---

## 2. Tehnologii folosite

### 🔹 Frontend

| Tehnologie        | Versiune | Rol                             |
| ----------------- | -------- | ------------------------------- |
| **React**         | 18+      | Framework pentru UI             |
| **TailwindCSS**   | 3+       | Sistem rapid de stilizare       |
| **React Hooks**   | -        | Gestionarea starii si efectelor |
| **Axios** | -        | Consumare API backend           |

**Integrare:**
Frontend-ul comunica direct cu backend-ul prin request-uri HTTP catre rutele expuse in serverul Node. TailwindCSS este integrat pentru stilizare rapida si layout responsive.

---

### 🔹 Backend

| Tehnologie    | Versiune | Rol                               |
| ------------- | -------- | --------------------------------- |
| **Node.js**   | 20.10    | Runtime server-side               |
| **Express**   | 4+       | Framework backend                 |
| **Sequelize** | 6+       | ORM pentru MySQL                  |
| **MySQL**     | 8+       | Baza de date relationala          |
| **dotenv**    | -        | Gestionarea variabilelor de mediu |

**Integrare:**
Serverul Express expune endpoint-uri REST. Sequelize gestioneaza modelele, migrarile si operatiile CRUD. Tot backend-ul este configurat astfel incat sa raspunda catre frontend prin JSON.

---

## 3. Structura proiectului

```
proiect/
│
├── client/          → Frontend React
│   ├── src/
│   └── package.json
│
├── server/          → Backend Node + Express
│   ├── database/
|   |      |──models
│   ├── routes/
│   ├── utils/
|   ├── uploads/
|   ├── .env
|   ├── dataUpd.js
|   ├── server.js
│   └── package.json
│
└── README.md
```

---

## 4. Instructiuni de pornire a proiectului
### 🔹 4.0. Clonare repo
```
git clone https://github.com/LaviniaMG/afaceri_proiect.git
cd proiect
```


### 🔹 4.1. Pornire Backend

1. Intra in folderul backend:

```
cd server
```

2. Instaleaza dependintele:

```
npm install
```

3. Configureaza fisierul `.env`:

```
PORT=4000
TOKEN_SECRET=323LDISN3934
```

4. Ruleaza serverul:

```
npm run dev
```

Serverul Express va porni pe `http://localhost:4000`.

---

### 🔹 4.2. Pornire Frontend

1. Intra in folderul frontend:

```
cd client
```

2. Instaleaza dependintele:

```
npm install
```

3. Porneste aplicatia:

```
npm start
```

Aplicatia React se va deschide la `http://localhost:3000`.

---

## 5. Mod de integrare front–back

* Frontend-ul trimite request-uri HTTP catre backend:

  * `GET` pentru preluare date
  * `POST` / `PUT` pentru trimitere sau modificare
  * `DELETE` pentru stergere

* Backend-ul valideaza input-ul, ruleaza interogari folosind Sequelize si returneaza raspunsuri JSON.

* Baza de date SQL gestioneaza tabelele si persistenta datelor.

---

## 6. Calitatea codului

Pentru a respecta cerintele proiectului, au fost aplicate urmatoarele reguli:

### ✔ Organizare clara in fisiere si foldere

* Frontend-ul este impartit pe componente si pagini
* Backend-ul este impartit pe rute, controllere si modele

### ✔ Standard de numire

* Variabile JavaScript: **camelCase**
* Nume componente React: **PascalCase**
* Modelele Sequelize: **PascalCase**

### ✔ Cod indentat si usor de citit

* Indentare corecta atat in frontend, cat si backend
* Fara cod duplicat sau blocuri mari necomentate
* Functiile sunt scurte si usor de inteles

---

## 7. Cum rulezi intreg proiectul

1. Pornesti backend-ul:

```
cd server
npm run dev
```

2. Pornesti frontend-ul:

```
cd client
npm start
```

3. Accesezi aplicatia din browser:

```
http://localhost:3000
```






