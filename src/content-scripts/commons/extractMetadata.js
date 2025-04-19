export function extractVideoMetadataFromJSONLD() {
  const jsonLdScript = document.querySelector(
    'script[type="application/ld+json"]'
  );
  if (!jsonLdScript) {
    return { title: "No title found", description: "No description found" };
  }

  try {
    const data = JSON.parse(jsonLdScript.innerText);
    const videoData = Array.isArray(data)
      ? data.find((d) => d["@type"] === "VideoObject")
      : data;
    return {
      title: videoData?.name || "No title found",
      description: videoData?.description || "No description found",
    };
  } catch (err) {
    console.error("Error parsing JSON-LD metadata:", err);
    return { title: "No title found", description: "No description found" };
  }
}
