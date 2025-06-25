# Distributed Storage File System (DSFS)

A simulated distributed file storage system that chunks and replicates files across multiple nodes with real-time monitoring, fault tolerance, and file integrity validation.

## Tech Stack

- Frontend: React.js, Tailwind CSS
- Backend: Node.js, Express.js, MongoDB
- Real-Time: Socket.io
- Extra: SHA256

## Folder Structure

```
dsfs/
├── client/     (React frontend)
├── server/     (Node.js backend)
├── uploads/    (Chunk storage)
└── shared/     (common utilities)
```

## Installation

### Prerequisites

- Node.js (v16 or higher recommended)
- MongoDB (running locally or accessible via URI)

### Client Setup

```bash
cd dsfs/client
npm install
npm run dev
```

This will start the React development server (Vite) on default port 5173.

### Server Setup

```bash
cd dsfs/server
npm install
npm run dev
```

This will start the backend server with nodemon on port 5000 (default).

## Running the Project

1. Start MongoDB if not already running.
2. Run the backend server (`npm run dev` in `dsfs/server`).
3. Run the frontend client (`npm run dev` in `dsfs/client`).
4. Optionally, run individual node scripts to simulate nodes:

```bash
npm run node1
npm run node2
npm run node3
```

## Usage

- **Upload Files:** Use the file uploader on the frontend to upload files. Files are chunked and distributed across nodes.
- **Monitor Nodes:** The Node Dashboard displays real-time status of nodes, replication, and health.
- **Download Files:** Download files from the distributed system via the frontend interface.
- **Replication Notifications:** Get real-time toast notifications about replication status.

## Features

- Distributed file chunking and replication across multiple nodes
- Real-time monitoring of node health and file replication
- Fault tolerance with file integrity validation using SHA256
- React frontend with Tailwind CSS for a responsive UI
- Node.js backend with Express and MongoDB for storage and API
- Real-time communication using Socket.io



