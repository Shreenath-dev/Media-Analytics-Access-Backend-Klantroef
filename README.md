Media Platform Backend

This is a robust backend for a media platform built with Node.js, Express, and MongoDB. It allows admin users to upload media files, generate secure streaming links, and track detailed analytics. The project includes features like JWT authentication, Redis caching for performance, and rate limiting for security.

Features

Secure Authentication: Signup and Login for admin users using JWT.

Media Upload: Upload audio/video files directly to an AWS S3 bucket.

Secure Streaming Links: Generate short-lived, signed URLs for media assets.

View Tracking & Analytics: Log every media view and retrieve aggregated analytics.

Redis Caching: Caches analytics data to reduce database load and improve response times.

Rate Limiting: Protects the view logging endpoint from abuse.

Dockerized: Comes with a multi-stage Dockerfile and docker-compose.yml for easy, optimized deployment.

Automated Testing: Includes a full test suite using Jest and Supertest.

Project Setup
Prerequisites

Node.js (v18 or higher)

MongoDB

Redis

Docker + Docker Compose

An AWS account with an S3 bucket

Installation & Setup

Clone the repository:

git clone <your-repository-url>
cd <repository-name>


Install dependencies (for local dev):

npm install


Set up environment variables:
Create local and Docker env files:

cp .env.example local.env
cp .env.example docker.env


Use local.env when running locally (npm start)

Use docker.env when running with Docker (docker-compose)

Start the development server locally:

npm start

Running with Docker

This project includes a docker-compose.yml that sets up the backend, MongoDB, and Redis in one command.

Build and start all services:

docker-compose --env-file docker.env up --build


Access the backend:
The backend will be available at:

http://localhost:5000


Stop services:

docker-compose down

Running Tests

To run the complete test suite, use:

npm test


✅ Now your Docker section matches reality:

Uses docker-compose

Uses docker.env

Runs on port 5000