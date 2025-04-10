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

  console.log('All results before saving:', allResults); // Debugging log

  allResults.push(result);
  allResults.sort((a, b) => b.score - a.score || a.timeUsed - b.timeUsed);

  console.log('All results after sorting:', allResults); // Debugging log

  const topResults = allResults.slice(0, 10);

  store.clear();
  topResults.forEach(res => store.add(res));

  console.log('Top results saved:', topResults); // Debugging log
};

export const getTopResults = async () => {
  const db = await openDatabase();
  const transaction = db.transaction('leaderboard', 'readonly');
  const store = transaction.objectStore('leaderboard');

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => {
      const results = request.result;
      console.log('Fetched leaderboard:', results);
      resolve(
        results.sort((a, b) => b.score - a.score || a.timeUsed - b.timeUsed)
      );
    };
    request.onerror = event => {
      console.error('Error fetching leaderboard:', event.target.error);
      reject(event.target.error);
    };
  });
};
