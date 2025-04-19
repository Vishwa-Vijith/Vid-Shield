export async function retryUntilTruthy(fn, retries = 15, delay = 300) {
  for (let i = 0; i < retries; i++) {
    const result = await fn();
    if (
      result &&
      result.title &&
      result.title !== "Title not found" &&
      result.description &&
      result.description !== "Description not found"
    ) {
      return result;
    }

    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  return {
    title: "Failed to extract title",
    description: "Failed to extract description",
  };
}
