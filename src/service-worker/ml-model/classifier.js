import { loadModel } from "./loadModel";
import { cleanText } from "./metaDataClean";

function tokenize(text) {
  return text.toLowerCase().split(/\s+/);
}

function vectorize(text, vocabularyObject) {
  const tokens = tokenize(text);
  const vector = new Array(Object.keys(vocabularyObject).length).fill(0);

  tokens.forEach((token) => {
    if (token in vocabularyObject) {
      const index = vocabularyObject[token];
      vector[index]++;
    }
  });

  return vector;
}

function predict(vector, modelData) {
  const { classes, class_log_prior, feature_log_prob } = modelData;

  const log_probs = classes.map((cls, idx) => {
    const classPrior = class_log_prior[idx];
    const logLikelihood = vector.reduce((sum, val, i) => {
      return sum + val * feature_log_prob[idx][i];
    }, 0);
    return classPrior + logLikelihood;
  });

  const predictedIndex = log_probs[0] > log_probs[1] ? 0 : 1;
  return classes[predictedIndex] === 1 ? "Productive" : "Non-Productive";
}

export async function classifyVideo(metadata) {
  const modelData = await loadModel();

  const cleaned = cleanText(metadata.title + " " + metadata.description);

  const vector = vectorize(cleaned, modelData.vocabulary);

  const result = predict(vector, modelData);

  return result;
}
