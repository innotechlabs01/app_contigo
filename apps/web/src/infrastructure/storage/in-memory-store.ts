// In-memory storage for Vercel serverless environment
// Note: Data will be lost on cold starts, but persists during function execution

export interface Storage {
  getAll<T>(collection: string): T[];
  getById<T>(collection: string, id: string): T | null;
  set<T>(collection: string, id: string, data: T): void;
  delete(collection: string, id: string): boolean;
}

export class InMemoryStore implements Storage {
  private static instance: InMemoryStore;
  private data: Map<string, Map<string, unknown>> = new Map();

  private constructor() {}

  static getInstance(): InMemoryStore {
    if (!InMemoryStore.instance) {
      InMemoryStore.instance = new InMemoryStore();
    }
    return InMemoryStore.instance;
  }

  getAll<T>(collection: string): T[] {
    const collectionData = this.data.get(collection);
    if (!collectionData) return [];
    return Array.from(collectionData.values()) as T[];
  }

  getById<T>(collection: string, id: string): T | null {
    const collectionData = this.data.get(collection);
    if (!collectionData) return null;
    return (collectionData.get(id) as T) || null;
  }

  set<T>(collection: string, id: string, data: T): void {
    if (!this.data.has(collection)) {
      this.data.set(collection, new Map());
    }
    const collectionData = this.data.get(collection)!;
    collectionData.set(id, data);
  }

  delete(collection: string, id: string): boolean {
    const collectionData = this.data.get(collection);
    if (!collectionData) return false;
    return collectionData.delete(id);
  }
}