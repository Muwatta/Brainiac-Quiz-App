export const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('BrainiacQuizDB', 1);

    request.onupgradeneeded = event => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('leaderboard')) {
        db.createObjectStore('leaderboard', {
          keyPath: 'id',
          autoIncrement: true,
        });
      }
    };

    request.onsuccess = event => {
      resolve(event.target.result);
    };

    request.onerror = event => {
      reject(event.target.error);
    };
  });
};

export const saveResult = async result => {
  const db = await openDatabase();
  const transaction = db.transaction('leaderboard', 'readwrite');
  const store = transaction.objectStore('leaderboard');

  const allResults = await new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = event => reject(event.target.error);
  });


  allResults.push(result);
  allResults.sort((a, b) => b.score - a.score || a.timeUsed - b.timeUsed);

  const topResults = allResults.slice(0, 10);

  store.clear();
  topResults.forEach(res => store.add(res));

};

export const getTopResults = async () => {
  const db = await openDatabase();
  const transaction = db.transaction('leaderboard', 'readonly');
  const store = transaction.objectStore('leaderboard');

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => {
      const results = request.result || []; // Handle empty data
      resolve(
        results.sort((a, b) => b.score - a.score || a.timeUsed - b.timeUsed)
      );
    };
    request.onerror = event => {
      resolve([]); // Return an empty array on error
    };
  });
};
