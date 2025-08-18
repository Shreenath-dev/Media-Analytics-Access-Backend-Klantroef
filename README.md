f````markdown
# 📺 Media Platform Backend

A production-ready **Node.js + Express backend** for managing media content.
It supports secure file uploads, streaming, analytics, caching, and deployment via Docker.

---

## 🚀 Features

-   🔐 **Secure Authentication** with JWT (Signup & Login for admins)
-   ☁️ **Media Uploads** to AWS S3
-   🎬 **Signed Streaming Links** (short-lived & secure)
-   📊 **View Tracking & Analytics** (logs every view with IP + timestamp)
-   ⚡ **Redis Caching** for analytics queries
-   🛡️ **Rate Limiting** to prevent abuse
-   🐳 **Dockerized Deployment** (with MongoDB + Redis)
-   ✅ **Automated Testing** (Jest + Supertest)

---

## 📂 Tech Stack

-   **Backend**: Node.js, Express
-   **Database**: MongoDB
-   **Cache**: Redis
-   **Storage**: AWS S3
-   **Testing**: Jest, Supertest
-   **Deployment**: Docker, Docker Compose

---

## ⚙️ Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or higher)
-   [MongoDB](https://www.mongodb.com/)
-   [Redis](https://redis.io/)
-   [AWS S3 Bucket](https://aws.amazon.com/s3/)
-   [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

---

## 📦 Installation & Local Setup

1.  **Clone the repository**
    ```bash
    git clone <your-repository-url>
    cd <repository-name>
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Create environment file**
    ```bash
    cp .env.example local.env
    ```
    Update the values inside `local.env`.

4.  **Run the server**
    ```bash
    npm start
    ```
    The server runs on: `http://localhost:5000`

---

## 🧾 Environment Variables

Create a `.env` or `docker.env` file with the following variables:

```env
# Server
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret

# Database
MONGO_URI=mongodb://localhost:27017/mail

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# AWS S3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
AWS_S3_BUCKET=your_bucket_name
````

-----

## 🐳 Running with Docker

### 1\. Build & Run with Docker

```bash
docker build -t media-platform-backend .
docker run --env-file docker.env -p 5000:5000 -d media-platform-backend
```

### 2\. Using Docker Compose (Recommended)

```bash
docker-compose up --build
```

This command starts the following services:

  - `app` → Node.js backend
  - `mongo` → MongoDB database
  - `redis` → Redis cache

Access the services at:

  - **Backend** → `http://localhost:5000`
  - **MongoDB** → `mongodb://mongo:27017/mail`
  - **Redis** → `redis://redis:6379`

To stop all running containers:

```bash
docker-compose down
```

-----

## 📡 API Endpoints (Sample)

### Auth

  - `POST /auth/signup` → Register a new admin user.
  - `POST /auth/login` → Login and receive a JWT.

### Media

  - `POST /media/upload` → Upload a media file to S3.
  - `GET /media/:id/stream` → Get a signed, temporary streaming link.

### Analytics

  - `POST /media/:id/view` → Log a view for a specific media file.
  - `GET /media/:id/analytics` → Fetch analytics data for a media file.

-----

## 🧪 Running Tests

Run all unit and integration tests:

```bash
npm test
```

```
```