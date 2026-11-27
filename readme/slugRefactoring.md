Il progetto gestisce due risorse con relazione 1:N: Avventura ed Episodio (gli episodi appartengono a un'avventura).

Ho deciso di sostituire gli ID numerici negli URL con gli SLUG (SEO-friendly URL), in modo da avere percorsi tipo: /avventure/:slugAvventura/episodi/:slugEpisodio

REGOLE PER QUESTA CONVERSAZIONE:

guidami nell'organizzazione logica, nell'architettura, nei controlli da fare e nei passaggi da seguire, spiegando ogni passaggio.
Procediamo passo dopo passo attendendo le mie conferme a ogni fase.

ROADMAP CHE VOGLIAMO SEGUIRE:

Aggiornamento dello schema Prisma (schema.prisma): aggiunta del campo slug ai modelli Avventura ed Episodio con i vincoli di unicità appropriati (mantenendo gli ID numerici come chiavi primarie/esterne) e allineamento del database.
Definizione della logica per una funzione helper di generazione dello slug a partire dal titolo (gestione caratteri speciali, spazi, accenti).
Riorganizzazione delle rotte e del controller per le Avventure basate su :slug (Show, Store con generazione slug, Update, Destroy).
Refactoring delle rotte e del controller per gli Episodi per integrare la ricerca e la creazione tramite slug.
