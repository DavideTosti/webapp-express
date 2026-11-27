const validazioneStringa = (valore) =>
  typeof valore === "string" && valore.trim() !== "";

const validazioneNumero = (valore) => {
  if (
    valore === null ||
    valore === undefined ||
    (typeof valore === "string" && valore.trim() === "")
  ) {
    return false;
  }
  const num = Number(valore);
  return Number.isInteger(num) && num > 0;
};

// Restituisce la stringa con .trim(), oppure undefined se non valida/assente (ideale per Prisma update)
export const trimmerStringa = (valore) =>
  validazioneStringa(valore) ? valore.trim() : undefined;
// Restituisce il numero intero, oppure undefined se assente/non valido
export const trimmerNumero = (valore) =>
  validazioneNumero(valore) ? Number(valore) : undefined;
