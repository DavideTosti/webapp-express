//1
Oggi andiamo a realizzare la parte di setup backend Express e Prisma:
Installazione Express
Definizione Router con le rotte CRUD (per ora ritornano solo testo) per la nostra entità scelta (products, movies, ecc)
Installazione e configurazione di Prisma
Definizione nello schema prisma di due modelli desiderati e in relazione tra loro, ad esempio Product e Category

//2
Assicuriamoci di avere due modelli in relazione uno a molti tra loro
Centralizzazione del Prisma client in un file sapearto, che poi useremo per seed e CRUD
Definizione di un file seed.js per la creazione dei dati di test iniziale per la tabella di categorie create attraverso lo schema Prisma. Se volete potete usare Faker.js: https://fakerjs.dev/
Definizione middlewares per gestione errori lato server e per le rotte not found, se non già implementati.
