// 本地存储服务 - IndexedDB操作

const DB_NAME = 'BabyMemoDB';
const DB_VERSION = 1;

// 打开数据库连接
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('数据库打开失败:', event.target.error);
      reject(event.target.error);
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // 创建存储对象
      if (!db.objectStoreNames.contains('photos')) {
        db.createObjectStore('photos', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('diaries')) {
        db.createObjectStore('diaries', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('events')) {
        db.createObjectStore('events', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('milestones')) {
        db.createObjectStore('milestones', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('babies')) {
        db.createObjectStore('babies', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('growth')) {
        db.createObjectStore('growth', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('videos')) {
        db.createObjectStore('videos', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    };
  });
};

// 通用操作方法
const storage = {
  // 获取所有数据
  getAll: async (storeName) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onerror = (event) => {
        reject(event.target.error);
      };

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
    });
  },

  // 根据ID获取数据
  getById: async (storeName, id) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onerror = (event) => {
        reject(event.target.error);
      };

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
    });
  },

  // 保存数据
  save: async (storeName, data) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onerror = (event) => {
        reject(event.target.error);
      };

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
    });
  },

  // 保存多个数据
  saveAll: async (storeName, dataArray) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);

      let count = 0;
      dataArray.forEach(item => {
        const request = store.put(item);
        request.onerror = (event) => {
          reject(event.target.error);
        };
        request.onsuccess = () => {
          count++;
          if (count === dataArray.length) {
            resolve();
          }
        };
      });
    });
  },

  // 删除数据
  delete: async (storeName, id) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onerror = (event) => {
        reject(event.target.error);
      };

      request.onsuccess = (event) => {
        resolve();
      };
    });
  },

  // 清空存储
  clear: async (storeName) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onerror = (event) => {
        reject(event.target.error);
      };

      request.onsuccess = (event) => {
        resolve();
      };
    });
  }
};

export default storage;