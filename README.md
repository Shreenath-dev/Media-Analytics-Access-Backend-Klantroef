# Media Platform Backend

This is a robust backend for a media platform built with Node.js, Express, and MongoDB. It allows admin users to upload media files, generate secure streaming links, and track detailed analytics. The project includes features like JWT authentication, Redis caching for performance, and rate limiting for security.

## Features

-   **Secure Authentication**: Signup and Login for admin users using JWT.
-   **Media Upload**: Upload audio/video files directly to an AWS S3 bucket.
-   **Secure Streaming Links**: Generate short-lived, signed URLs for media assets.
-   **View Tracking & Analytics**: Log every media view and retrieve aggregated analytics.
-   **Redis Caching**: Caches analytics data to reduce database load and improve response times.
-   **Rate Limiting**: Protects the view logging endpoint from abuse.
-   **Dockerized**: Comes with a multi-stage `Dockerfile` for easy, optimized deployment.
-   **Automated Testing**: Includes a full test suite using Jest and Supertest.

---

## Project Setup

### Prerequisites

-   Node.js (v18 or higher)
-   MongoDB
-   Redis
-   Docker
-   An AWS account with an S3 bucket

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-name>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project by copying the example file:
    ```bash
    cp .env.example .env local.env
    ```
    Now, open the `.env` file and fill in your actual credentials.

4.  **Start the development server:**
    ```bash
    npm start
    ```

---

## Running with Docker

1.  **Build the Docker image:**
    ```bash
    docker build -t media-platform-backend .
    ```

2.  **Run the Docker container:**
    Make sure your `.env` file is complete, then run:
    ```bash
    docker run --env-file .env -p 3000:3000 -d media-platform-backend
    ```

---

## Running Tests

To run the complete test suite, use the following command:

```bash
npm test
