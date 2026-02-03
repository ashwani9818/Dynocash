# Docker Setup Guide for Local Development

This guide will help you run the DynoBackend locally using Docker with a local PostgreSQL database.

## 📋 Prerequisites

- Docker Desktop installed ([Download here](https://www.docker.com/products/docker-desktop))
- Docker Compose (included with Docker Desktop)

## 🚀 Quick Start

### 1. Create Environment File

Create `.env.local` from the template:

```bash
cp env.local.template .env.local
```

The `.env.local` file is configured with local database credentials that match `docker-compose.yml`:

```env
DB_NAME=dynopay_local
USER_NAME=postgres
PASSWORD=postgres123
HOST=postgres
DB_PORT=5432
REDIS_PUBLIC_URL=redis://redis:6379
```

**Important:** Update other API keys in `.env.local` with your test/sandbox credentials.

### 2. Build and Start Services

```bash
# Build and start all services (PostgreSQL, Redis, Backend)
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop all services
docker-compose down

# Stop and remove volumes (clears database)
docker-compose down -v
```

### 3. Run Database Migrations

```bash
# Run migrations inside the backend container
docker-compose exec backend npm run migrate
```

## 📊 Database Credentials

### Local Docker Database (Already Configured)

| Setting | Value |
|---------|-------|
| **Database Name** | `dynopay_local` |
| **Username** | `postgres` |
| **Password** | `postgres123` |
| **Host** | `postgres` (container name) |
| **Port** | `5432` |
| **Connection String** | `postgresql://postgres:postgres123@postgres:5432/dynopay_local` |

### Redis Credentials

| Setting | Value |
|---------|-------|
| **Host** | `redis` (container name) |
| **Port** | `6379` |
| **URL** | `redis://redis:6379` |

## 🔧 Services Overview

### Services Running:

1. **PostgreSQL** (`postgres`)
   - Port: `5432`
   - Database: `dynopay_local`
   - Data persists in Docker volume

2. **Redis** (`redis`)
   - Port: `6379`
   - Data persists in Docker volume

3. **Backend** (`backend`)
   - Port: `3300`
   - Uses `.env.local` for configuration
   - Connected to PostgreSQL and Redis

## 📝 Common Commands

### Start Services
```bash
docker-compose up -d
```

### View Logs
```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# PostgreSQL only
docker-compose logs -f postgres
```

### Stop Services
```bash
docker-compose down
```

### Restart Services
```bash
docker-compose restart
```

### Rebuild Backend (after code changes)
```bash
docker-compose up -d --build backend
```

### Access Database
```bash
# Connect to PostgreSQL from host machine
psql -h localhost -U postgres -d dynopay_local
# Password: postgres123

# Or use Docker
docker-compose exec postgres psql -U postgres -d dynopay_local
```

### Access Redis
```bash
docker-compose exec redis redis-cli
```

### Run Commands in Backend Container
```bash
# Run migrations
docker-compose exec backend npm run migrate

# Access shell
docker-compose exec backend sh

# Run any npm script
docker-compose exec backend npm run <script>
```

## 🔐 Security Notes

1. **Database Password**: The default password `postgres123` is for local development only. Change it in:
   - `docker-compose.yml` (postgres service)
   - `.env.local` (PASSWORD)

2. **API Keys**: Use TEST/SANDBOX keys for all third-party services in `.env.local`

3. **Never Commit**: `.env.local` is in `.gitignore` and won't be committed

## 🗄️ Database Management

### Create Database Backup
```bash
docker-compose exec postgres pg_dump -U postgres dynopay_local > backup.sql
```

### Restore Database
```bash
docker-compose exec -T postgres psql -U postgres dynopay_local < backup.sql
```

### Reset Database (Clear all data)
```bash
docker-compose down -v
docker-compose up -d
docker-compose exec backend npm run migrate
```

## 🐛 Troubleshooting

### Port Already in Use
If port 3300, 5432, or 6379 is already in use:

1. Stop existing services using those ports
2. Or change ports in `docker-compose.yml`:
   ```yaml
   ports:
     - "3301:3300"  # Change host port
   ```

### Database Connection Error
```bash
# Check if PostgreSQL is running
docker-compose ps

# Check PostgreSQL logs
docker-compose logs postgres

# Restart PostgreSQL
docker-compose restart postgres
```

### Backend Won't Start
```bash
# Check backend logs
docker-compose logs backend

# Rebuild backend
docker-compose up -d --build backend
```

### Clear Everything and Start Fresh
```bash
# Stop and remove everything
docker-compose down -v

# Remove images
docker-compose rm -f

# Start fresh
docker-compose up -d --build
```

## 📁 File Structure

```
DynoBackend-workakash/
├── Dockerfile              # Backend container definition
├── docker-compose.yml      # Multi-container setup
├── .env.local              # Local environment variables
├── .dockerignore           # Files to exclude from Docker build
└── ...
```

## 🔄 Development Workflow

1. **Make code changes** in your editor
2. **Rebuild backend** if needed:
   ```bash
   docker-compose up -d --build backend
   ```
3. **View logs** to see changes:
   ```bash
   docker-compose logs -f backend
   ```

## ✅ Verify Setup

1. Check all services are running:
   ```bash
   docker-compose ps
   ```

2. Test backend endpoint:
   ```bash
   curl http://localhost:3300/
   ```

3. Check database connection:
   ```bash
   docker-compose exec backend npm run migrate
   ```

## 🎯 Next Steps

1. Update API keys in `.env.local` with your test credentials
2. Run database migrations
3. Start developing!

---

**Note:** This setup is for **local development only**. Production deployments should use managed databases and proper security configurations.

