let dbPromise = null;

export async function openDatabase() {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const dbName = "VidShieldDatabase";
    const dbVersion = 1;
    const request = indexedDB.open(dbName, dbVersion);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains("BlockedVideos")) {
        const objectStore = db.createObjectStore("BlockedVideos", {
          keyPath: "videoId",
        });
        objectStore.createIndex("timestamp", "timestamp", { unique: false });
      }
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });

  return dbPromise;
}

async function getTransaction(storeName, mode) {
  const db = await openDatabase();
  const tx = db.transaction(storeName, mode);
  return tx.objectStore(storeName);
}

export async function saveBlockedVideo(videoId) {
  const objectStore = await getTransaction("BlockedVideos", "readwrite");
  const request = objectStore.put({
    videoId,
    timestamp: new Date().toISOString(),
  });

  request.onsuccess = () => {
    console.log("Blocked video saved:", videoId, new Date().toISOString());
  };

  request.onerror = (event) => {
    console.error("Error saving blocked video:", event.target.error);
  };
}

export async function checkVideoExists(videoId) {
  const objectStore = await getTransaction("BlockedVideos", "readonly");
  return new Promise((resolve, reject) => {
    const request = objectStore.get(videoId);

    request.onsuccess = (event) => {
      const result = event.target.result;
      resolve(!!result);
    };

    request.onerror = (event) => {
      console.error("Error checking video:", event.target.error);
      reject(false);
    };
  });
}

export async function getAllBlockedVideos() {
  const objectStore = await getTransaction("BlockedVideos", "readonly");
  return new Promise((resolve, reject) => {
    const request = objectStore.getAll();

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      console.error("Error fetching blocked videos:", event.target.error);
      reject([]);
    };
  });
}

export async function deleteBlockedVideo(videoId) {
  const objectStore = await getTransaction("BlockedVideos", "readwrite");
  return new Promise((resolve, reject) => {
    const request = objectStore.delete(videoId);

    request.onsuccess = () => {
      console.log("Deleted video from IndexedDB:", videoId);
      resolve(true);
    };

    request.onerror = (event) => {
      console.error("Error deleting video:", event.target.error);
      reject(false);
    };
  });
}

