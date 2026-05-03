import { InMemoryStore } from './in-memory-store';
import { JsonFileStore } from './json-file-store';

// Storage types
export type StorageBackend = 'memory' | 'json' | 'postgres';

interface StorageConfig {
  backend: StorageBackend;
  connectionString?: string;
  filePath?: string;
}

// Get storage configuration from environment
function getStorageConfig(): StorageConfig {
  const backend = (process.env.STORAGE_BACKEND as StorageBackend) || 'json';

  return {
    backend,
    connectionString: process.env.DATABASE_URL,
    filePath: process.env.STORAGE_FILE_PATH || './data/storage.json',
  };
}

// Storage factory - creates the appropriate storage backend
export function createStorage() {
  const config = getStorageConfig();

  switch (config.backend) {
    case 'postgres':
      // TODO: Implement PostgreSQL backend when DATABASE_URL is configured
      console.warn('PostgreSQL backend not implemented yet. Using JSON storage.');
      return new JsonFileStore(config.filePath!);

    case 'json':
      return new JsonFileStore(config.filePath!);

    case 'memory':
    default:
      return InMemoryStore.getInstance();
  }
}

// Re-export InMemoryStore for backward compatibility
export const storage = createStorage();