import { handleWatchPage } from "./pages/watchPage.js";

let lastVideoId = null;
let lastPath = null;
let isProcessing = false;

function getCurrentVideoId() {
  const path = window.location.pathname;
  if (path.startsWith("/watch")) {
    return new URLSearchParams(window.location.search).get("v");
  } else if (path.startsWith("/shorts")) {
    return path.split("/shorts/")[1]?.split("?")[0];
  }
  return null;
}

function getCurrentPageType() {
  const path = window.location.pathname;
  if (path.startsWith("/watch")) return "watch";
  if (path.startsWith("/shorts")) return "shorts";
  return "home";
}

async function routeToHandler() {
  if (isProcessing) return;
  isProcessing = true;

  try {
    const videoId = getCurrentVideoId();
    const pageType = getCurrentPageType();

    if (!videoId && pageType !== "home") {
      isProcessing = false;
      return;
    }

    if (videoId === lastVideoId && pageType === lastPath) {
      isProcessing = false;
      return;
    }

    lastVideoId = videoId;
    lastPath = pageType;

    switch (pageType) {
      case "watch":
        sessionStorage.removeItem("redirectedFromShorts");
        await handleWatchPage(videoId);
        break;

      case "shorts":
        const alreadyRedirected = sessionStorage.getItem(
          "redirectedFromShorts"
        );
        if (!alreadyRedirected && videoId) {
          sessionStorage.setItem("redirectedFromShorts", "true");
          const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

          if (window.yt && window.yt.navigate) {
            window.yt.navigate(watchUrl);
          } else {
            window.location.href = watchUrl;
          }
        }
        break;

      case "home":
        sessionStorage.removeItem("redirectedFromShorts");
        break;
    }
  } finally {
    isProcessing = false;
  }
}

function initRouter() {
  const debouncedRoute = debounce(routeToHandler, 300);

  const navigationHandler = (event) => {
    if (event.type === "yt-navigate-finish") {
      debouncedRoute();
    }
  };

  window.addEventListener("yt-navigate-finish", navigationHandler);

  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(routeToHandler, 500);
  });
}

function debounce(fn, delay) {
  let timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(), delay);
  };
}

initRouter();