export async function loadModel() {
  const response = await fetch(
    chrome.runtime.getURL("service-worker/ml-model/model.json")
  );
  const modelData = await response.json();
  return modelData;
}
