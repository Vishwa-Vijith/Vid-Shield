import { classifyVideo } from "./ml-model/classifier";
import { blockNonProductive } from "./persistence/blocker";
import { checkVideoExists, saveBlockedVideo } from "./persistence/db";
import { updateExpiredVideoRules } from "./persistence/updater";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "VIDSHIELD-VIDEO_METADATA") {
    const { videoId } = message;
    const { title, description } = message.payload;

    classifyVideo({ title, description }).then(async (prediction) => {

       chrome.tabs.sendMessage(sender.tab?.id, {
        type: "VIDSHIELD-BLOCK_VIDEO",
        videoId,
        classification: prediction
        });

        if (prediction === "Non-Productive") {
            const alreadyBlocked = await checkVideoExists(videoId);
            if (!alreadyBlocked) {
                await saveBlockedVideo(videoId);
                await blockNonProductive(videoId);
            }
        }
        return true;
    });
  }
});

(async function init() {
  try {
    const { lastCleanup } = await chrome.storage.local.get("lastCleanup");
    const now = Date.now();
    const oneDayAgo = now - 86400000;

    if (!lastCleanup || new Date(lastCleanup).getTime() < oneDayAgo) {
      await updateExpiredVideoRules();
      await chrome.storage.local.set({ lastCleanup: new Date().toISOString() });
    }

    if (location.hostname === "www.youtube.com") {
      await updateExpiredVideoRules();
    }
  } catch (error) {
    console.error("Init cleanup error:", error);
  }
})();

