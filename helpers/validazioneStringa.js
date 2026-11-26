const validazioneStringa = (valore) =>
  typeof valore === "string" && valore.trim() !== "";

export default validazioneStringa;
