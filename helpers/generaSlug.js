import { trimmerStringa } from "./trimmer.js";

export function generaSlug(testo) {
  const testoValido = trimmerStringa(testo);
  if (!testoValido) return undefined;

  return testoValido
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
