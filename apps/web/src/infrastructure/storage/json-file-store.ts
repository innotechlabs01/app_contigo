// JSON file-based storage
// Works with Vercel when using Vercel Blob or similar file storage
// For local development, uses local file system

import fs from 'fs';
import path from 'path';

interface StorageData {
  [key: string]: unknown;
}

export class JsonFileStore {
  private filePath: string;
  private data: Map<string, Map<string, unknown>>;
  private initialized: boolean = false;

  constructor(filePath: string = './data/storage.json') {
    this.filePath = filePath;
    this.data = new Map();
  }

  private async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (fs.existsSync(this.filePath)) {
        const content = fs.readFileSync(this.filePath, 'utf-8');
        const parsed = JSON.parse(content) as Record<string, StorageData>;

        for (const [collection, items] of Object.entries(parsed)) {
          const map = new Map<string, unknown>();
          for (const [id, data] of Object.entries(items)) {
            map.set(id, data);
          }
          this.data.set(collection, map);
        }
      }
    } catch (error) {
      console.error('Failed to initialize JSON storage:', error);
    }

    this.initialized = true;
  }

  private async persist(): Promise<void> {
    try {
      const obj: Record<string, StorageData> = {};

      for (const [collection, items] of this.data.entries()) {
        obj[collection] = {};
        for (const [id, data] of items.entries()) {
          obj[collection][id] = data;
        }
      }

      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(this.filePath, JSON.stringify(obj, null, 2));
    } catch (error) {
      console.error('Failed to persist JSON storage:', error);
    }
  }

  async getAll<T>(collection: string): Promise<T[]> {
    await this.initialize();
    const collectionData = this.data.get(collection);
    if (!collectionData) return [];
    return Array.from(collectionData.values()) as T[];
  }

  async getById<T>(collection: string, id: string): Promise<T | null> {
    await this.initialize();
    const collectionData = this.data.get(collection);
    if (!collectionData) return null;
    return (collectionData.get(id) as T) || null;
  }

  async set<T>(collection: string, id: string, data: T): Promise<void> {
    await this.initialize();
    if (!this.data.has(collection)) {
      this.data.set(collection, new Map());
    }
    const collectionData = this.data.get(collection)!;
    collectionData.set(id, data);
    await this.persist();
  }

  async delete(collection: string, id: string): Promise<boolean> {
    await this.initialize();
    const collectionData = this.data.get(collection);
    if (!collectionData) return false;
    const result = collectionData.delete(id);
    if (result) await this.persist();
    return result;
  }
}