export async function blockNonProductive(vedioId) {
    await chrome.declarativeNetRequest.updateDynamicRules({
      addRules: [
        {
          id: vedioId,
          priority: 1,
          action: { type: "block" },
          condition: {
            urlFilter: videoId,
            resourceTypes: ["media", "xmlhttprequest"],
          },
        },
      ],
      removeRuleIds: [ruleId],
    });
}