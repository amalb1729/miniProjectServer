# Student Store - Backend Server

This is the backend server for the Student Store application. It is a RESTful API built with Node.js and Express, and it handles all business logic, database interactions, and authentication.

## Features

*   User authentication and authorization using JSON Web Tokens (JWT).
*   CRUD (Create, Read, Update, Delete) operations for products.
*   Order processing and management.
*   Serves data to both the `admin-ui` and `user-ui` frontends.

## Technology Stack

*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB with Mongoose ODM
*   **Authentication**: JSON Web Tokens (JWT)

## Prerequisites

*   Node.js (v16 or later)
*   npm
*   MongoDB

## Getting Started

1.  **Navigate to the directory**
    From the root of the `studentStore` project, `cd server`.

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in this directory by copying the example file:
    ```bash
    cp .env.example .env
    ```
    Now, open the `.env` file and update the variables with your local configuration, especially your MongoDB connection string and a secure JWT secret.

    ```
    # Port for the server to run on
    PORT=5000

    # Your MongoDB connection URI
    MONGO_URI=mongodb://localhost:27017/student-store

    # A strong, secret key for signing JWTs
    JWT_SECRET=replace-with-a-very-strong-secret
    ```

4.  **Run the Development Server**
    This command starts the server with `nodemon`, which will automatically restart on file changes.
    ```bash
    npm run dev
    ```
    The API will be available at `http://localhost:5000`.

