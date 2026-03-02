export const normalizeText = (text: string) =>
  text.replace(/\s+/g, " ").toUpperCase();

export const normalizeRfc = (text: string) =>
  text.replace(/\s+/g, "").toUpperCase().slice(0, 13);
