import { trimmerStringa } from "./trimmer.js";

export function generaSlug(testo) {
  const testoValido = trimmerStringa(testo);
  if (!testoValido) return undefined;

  return testoValido
    .toLowerCase() //Converte tutto in minuscolo
    .normalize("NFD") //Normalizza i caratteri accentati
    .replace(/[\u0300-\u036f]/g, "") //rimuove caratteri diacritici (accenti, cedille, tildes…)
    .replace(/[^a-z0-9]+/g, "-") //Sostituisce con - qualsiasi sequenza di caratteri che NON sia una lettera minuscola (a-z) o un numero (0-9)
    .replace(/^-+|-+$/g, ""); //Rimuove i trattini all'inizio (^-+) e alla fine (-+$) della stringa
}
