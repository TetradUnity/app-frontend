'use client';

export const DraftService = {
    createStore: <T>(key: string) => ({
        load(): T | undefined {
            let draft = localStorage.getItem(key);
            if (!draft) {
                return;
            }
            return JSON.parse(draft).data;
        },
    
        remove() {
            return localStorage.removeItem(key);
        },
    
        save(data: T) {
            localStorage.setItem(key, JSON.stringify({
                date: Date.now(),
                data
            }));
        },
    
        isExist() {
            return localStorage.getItem(key) != null;
        },

        getDraftDate() {
            let draft = localStorage.getItem(key);
            if (!draft) {
                return;
            }
            return JSON.parse(draft).date;
        }
    })
};