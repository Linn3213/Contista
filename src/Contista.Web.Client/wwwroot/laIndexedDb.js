// wwwroot/laIndexedDb.js
(function () {
    "use strict";

    const DB_NAME = "la.offline";
    const DB_VERSION = 1;

    const STORE_QUEUE = "syncQueue";
    const STORE_CACHE = "cache";

    // ✅ MÅSTE deklareras (annars ReferenceError)
    /** @type {Promise<IDBDatabase> | null} */
    let _dbPromise = null;

    function openDb() {
        if (_dbPromise) return _dbPromise;

        _dbPromise = new Promise((resolve, reject) => {
            const req = indexedDB.open(DB_NAME, DB_VERSION);

            req.onupgradeneeded = () => {
                const db = req.result;

                if (!db.objectStoreNames.contains(STORE_QUEUE)) {
                    const s = db.createObjectStore(STORE_QUEUE, { keyPath: "id" });
                    s.createIndex("status", "status", { unique: false });
                    s.createIndex("createdAtUtc", "createdAtUtc", { unique: false });
                    s.createIndex("lastAttemptUtc", "lastAttemptUtc", { unique: false });
                }

                if (!db.objectStoreNames.contains(STORE_CACHE)) {
                    const s = db.createObjectStore(STORE_CACHE, { keyPath: "key" });
                    s.createIndex("key", "key", { unique: true });
                }
            };

            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);

            // optional: om någon blockerar upgrade (annan flik öppen)
            req.onblocked = () => reject(new Error("IndexedDB upgrade blocked (another tab?)"));
        });

        return _dbPromise;
    }

    function tx(db, store, mode = "readonly") {
        return db.transaction(store, mode).objectStore(store);
    }

    async function queueGetById(id) {
        const db = await openDb();
        return new Promise((resolve, reject) => {
            const store = tx(db, STORE_QUEUE, "readonly");
            const req = store.get(id);
            req.onsuccess = () => resolve(req.result || null);
            req.onerror = () => reject(req.error);
        });
    }

    async function queueGetAll() {
        const db = await openDb();
        return new Promise((resolve, reject) => {
            const store = tx(db, STORE_QUEUE, "readonly");
            const req = store.getAll();
            req.onsuccess = () => resolve(req.result || []);
            req.onerror = () => reject(req.error);
        });
    }

    async function queueUpsert(item) {
        const db = await openDb();
        return new Promise((resolve, reject) => {
            const store = tx(db, STORE_QUEUE, "readwrite");
            const req = store.put(item);
            req.onsuccess = () => resolve(true);
            req.onerror = () => reject(req.error);
        });
    }

    async function queueDelete(id) {
        const db = await openDb();
        return new Promise((resolve, reject) => {
            const store = tx(db, STORE_QUEUE, "readwrite");
            const req = store.delete(id);
            req.onsuccess = () => resolve(true);
            req.onerror = () => reject(req.error);
        });
    }

    async function queueClear() {
        const db = await openDb();
        return new Promise((resolve, reject) => {
            const store = tx(db, STORE_QUEUE, "readwrite");
            const req = store.clear();
            req.onsuccess = () => resolve(true);
            req.onerror = () => reject(req.error);
        });
    }

    async function queueCountByStatus(status) {
        const db = await openDb();
        return new Promise((resolve, reject) => {
            const store = tx(db, STORE_QUEUE, "readonly");
            const idx = store.index("status");
            const req = idx.count(status);
            req.onsuccess = () => resolve(req.result || 0);
            req.onerror = () => reject(req.error);
        });
    }

    // Pending: äldst CreatedAt
    async function queueGetNextPending() {
        const all = await queueGetAll();
        const pending = all
            .filter(x => x.status === "Pending" || x.status === 0) // enum 0
            .sort((a, b) => (a.createdAtUtc || "").localeCompare(b.createdAtUtc || ""));
        return pending.length ? pending[0] : null;
    }

    // Cache: entry { key, json, version, updatedAtUtc }
    async function cacheGet(key) {
        const db = await openDb();
        return new Promise((resolve, reject) => {
            const store = tx(db, STORE_CACHE, "readonly");
            const req = store.get(key);
            req.onsuccess = () => resolve(req.result || null);
            req.onerror = () => reject(req.error);
        });
    }

    async function cacheSet(entry) {
        const db = await openDb();
        return new Promise((resolve, reject) => {
            const store = tx(db, STORE_CACHE, "readwrite");
            const req = store.put(entry);
            req.onsuccess = () => resolve(true);
            req.onerror = () => reject(req.error);
        });
    }

    async function cacheRemove(key) {
        const db = await openDb();
        return new Promise((resolve, reject) => {
            const store = tx(db, STORE_CACHE, "readwrite");
            const req = store.delete(key);
            req.onsuccess = () => resolve(true);
            req.onerror = () => reject(req.error);
        });
    }

    window.laIndexedDb = {
        queueGetAll,
        queueGetById, 
        queueUpsert,
        queueDelete,
        queueClear,
        queueCountByStatus,
        queueGetNextPending,
        cacheGet,
        cacheSet,
        cacheRemove
    };
})();
