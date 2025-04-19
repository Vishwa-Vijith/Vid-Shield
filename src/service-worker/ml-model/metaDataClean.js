export function cleanText(text) {
  if (!text) return "";

  text = text.toLowerCase();

  text = text.replace(/https?:\/\/\S+|www\.\S+/g, "");

  text = text.replace(/[^a-z0-9\s]/g, "");

  text = text.replace(/\s+/g, " ").trim();

  const stopWords = new Set([
    "a",
    "an",
    "and",
    "the",
    "of",
    "in",
    "on",
    "at",
    "to",
    "for",
    "is",
    "are",
    "was",
    "were",
    "be",
    "with",
    "as",
    "by",
    "this",
    "that",
    "from",
    "it",
    "or",
    "but",
    "so",
    "if",
    "then",
    "out",
    "about",
    "you",
    "your",
    "we",
    "our",
  ]);

  text = text
    .split(" ")
    .filter((word) => !stopWords.has(word))
    .join(" ");

  return text;
}
