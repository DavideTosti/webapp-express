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

export default validazioneNumero;
