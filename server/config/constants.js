const path = require('path');

module.exports = {
  REPLICATION_FACTOR: 2,
  STORAGE_NODES : ['node1', 'node2', 'node3'],
  CHUNKS_DIR: path.join(__dirname, '..', 'chunks'),
  CHUNK_SIZE: 1024 * 1024, // 1MB
  encryptionKey: process.env.ENCRYPTION_KEY // 32-byte key from .env
};
