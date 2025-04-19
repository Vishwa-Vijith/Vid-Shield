import { extractVideoMetadataFromJSONLD } from "../commons/extractMetadata.js";
import { retryUntilTruthy } from "../commons/retryUtilTruthy.js";

export async function handleWatchPage(videoId) {
  const metadata = await retryUntilTruthy(extractVideoMetadataFromJSONLD);

  chrome.runtime.sendMessage({
    type: "VIDSHIELD-VIDEO_METADATA",
    payload: {
      title: metadata.title,
      description: metadata.description,
    },
    videoId: videoId,
  });
}


let currentBlockedVideoId = null;
let isBlockingActive = false;
let observer = null;

function setupVideoBlocker(videoId) {
  cleanupBlocker();
  
  currentBlockedVideoId = videoId;
  isBlockingActive = true;

  const blockerHTML = `
    <div id="vidshield-blocker" style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9999;
      background: #000;
      color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 20px;
      box-sizing: border-box;
      font-family: 'YouTube Noto', Roboto, Arial, sans-serif;
    ">
      <div style="font-size: 24px; margin-bottom: 16px;">🚫 VidShield Protection Active</div>
      <div style="font-size: 18px; margin-bottom: 24px;">
        This video has been classified as <strong>Non-Productive</strong>
      </div>
      <div style="font-size: 14px; color: #aaa; margin-bottom: 24px;">
        Video ID: ${videoId}
      </div>
      <button id="vidshield-unblock" style="
        background: #303030;
        color: #fff;
        border: none;
        padding: 10px 20px;
        border-radius: 2px;
        cursor: pointer;
        font-size: 14px;
      ">Show Anyway (Temporarily)</button>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', blockerHTML);

  document.getElementById('vidshield-unblock')?.addEventListener('click', () => {
    chrome.runtime.sendMessage({
      type: 'VIDSHIELD-TEMPORARY_UNBLOCK',
      videoId: videoId
    });
    cleanupBlocker();
  });

  blockVideoElements();

  setupMutationObserver();

  window.addEventListener('yt-navigate-finish', handleNavigation);
}

function blockVideoElements() {
  if (!isBlockingActive) return;

  document.querySelectorAll('video, audio').forEach(el => {
    el.pause();
    el.src = '';
    el.srcObject = null;
    el.remove();
  });

  const containers = [
    '#movie_player',
    '.html5-video-player',
    'ytd-watch-flexy',
    '#container.style-scope.ytd-player'
  ];
  
  containers.forEach(selector => {
    const el = document.querySelector(selector);
    if (el) el.style.display = 'none';
  });
}

function setupMutationObserver() {
  if (observer) observer.disconnect();

  observer = new MutationObserver(mutations => {
    if (!isBlockingActive) return;

    const shouldBlock = mutations.some(mutation => {
      return Array.from(mutation.addedNodes).some(node => {
        if (node.nodeType === 1) {
          return node.matches?.('video, audio') || 
                 node.querySelector?.('video, audio, #movie_player');
        }
        return false;
      });
    });

    if (shouldBlock) {
      blockVideoElements();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

function cleanupBlocker() {
  isBlockingActive = false;
  currentBlockedVideoId = null;
  
  const blocker = document.getElementById('vidshield-blocker');
  if (blocker) blocker.remove();

  if (observer) {
    observer.disconnect();
    observer = null;
  }

  const containers = [
    '#movie_player',
    '.html5-video-player',
    'ytd-watch-flexy',
    '#container.style-scope.ytd-player'
  ];
  
  containers.forEach(selector => {
    const el = document.querySelector(selector);
    if (el) el.style.display = '';
  });

  window.removeEventListener('yt-navigate-finish', handleNavigation);
}

function handleNavigation() {
  const currentVideoId = new URLSearchParams(window.location.search).get('v');
  
  if (currentVideoId !== currentBlockedVideoId) {
    cleanupBlocker();
  }
  else if (currentBlockedVideoId) {
    setupVideoBlocker(currentBlockedVideoId);
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'VIDSHIELD-BLOCK_VIDEO') {
    const { videoId, classification } = message;
    const currentVideoId = new URLSearchParams(window.location.search).get('v');

    if (currentVideoId === videoId && classification === 'Non-Productive') {
      setupVideoBlocker(videoId);
    }
  }
  else if (message.type === 'VIDSHIELD-UNBLOCK_VIDEO') {
    cleanupBlocker();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const currentVideoId = new URLSearchParams(window.location.search).get('v');
  if (currentVideoId) {
    chrome.runtime.sendMessage({
      type: 'VIDSHIELD-CHECK_VIDEO',
      videoId: currentVideoId
    });
  }
});

window.addEventListener('yt-navigate-finish', () => {
  const currentVideoId = new URLSearchParams(window.location.search).get('v');
  if (currentVideoId) {
    chrome.runtime.sendMessage({
      type: 'VIDSHIELD-CHECK_VIDEO',
      videoId: currentVideoId
    });
  }
});
