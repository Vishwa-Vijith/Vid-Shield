import { getAllBlockedVideos, deleteBlockedVideo } from "./db";

function isOlderThan15Days(timestamp) {
  const storedDate = new Date(timestamp);
  const now = new Date();
  const diffInDays = (now - storedDate) / (1000 * 60 * 60 * 24);
  return diffInDays > 15;
}

export async function updateExpiredVideoRules() {
  try {
    const blockedVideos = await getAllBlockedVideos();
    const expiredVideos = blockedVideos.filter((video) =>
      isOlderThan15Days(video.timestamp)
    );

    if (expiredVideos.length === 0) {
      console.log("No expired videos found in IndexedDB");
      return;
    }

    console.log(`Found ${expiredVideos.length} videos older than 15 days`);

    const currentRules = await chrome.declarativeNetRequest.getDynamicRules();
    const ruleIdsToRemove = [];

    for (const video of expiredVideos) {
      const matchingRule = currentRules.find(
        (rule) =>
          rule.condition.urlFilter &&
          rule.condition.urlFilter.includes(video.videoId)
      );

      if (matchingRule) {
        ruleIdsToRemove.push(matchingRule.id);
      }

      await deleteBlockedVideo(video.videoId);
    }

    if (ruleIdsToRemove.length > 0) {
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: ruleIdsToRemove,
      });

      console.log(`Removed ${ruleIdsToRemove.length} expired video rules`);
    }
  } catch (error) {
    console.error("Error cleaning expired rules:", error);
  }
}