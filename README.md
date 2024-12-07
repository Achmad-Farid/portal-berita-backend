# Portal Berita Backend

This backend is built using **Express** and provides a RESTful API for the Portal Berita project. Several routes are protected using **JWT** tokens for authentication, ensuring secure access to certain endpoints.

## Features
- **JWT Authentication**: Protects routes such as admin, journalist, and user actions.
- **Article Management**: Allows creation, update, search, and retrieval of articles.
- **User Management**: Admin can manage user roles and permissions.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Achmad-Farid/portal-berita-backend.git
    cd portal-berita-backend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the server:
    ```bash
    npm start
    ```

4. The API will be available at `http://localhost:5000`.

## Protected Routes (JWT Required)
- **Admin**: `/admin/*`
- **Journalist**: `/journalist/*`
- **User**: `/user/*`

## API Routes Documentation

### Authentication Routes (`/auth`)

- **POST /signup**  
  Registers a new user.
  - **Request Body**:
    ```json
    {
      "email": "user@example.com",
      "username": "user123",
      "password": "password123"
    }
    ```
  - **Response** (Success):
    ```json
    {
      "message": "Pendaftaran user@example.com Berhasil"
    }
    ```

- **POST /login**  
  Logs in a user and returns a JWT token.
  - **Request Body**:
    ```json
    {
      "identifier": "user@example.com",
      "password": "password123"
    }
    ```
  - **Response** (Success):
    ```json
    {
      "success": true,
      "message": "Login berhasil",
      "token": "JWT_TOKEN_HERE"
    }
    ```
  - **Response** (Error):
    ```json
    {
      "success": false,
      "message": "Invalid password"
    }
    ```

- **GET /google**  
  Initiates Google OAuth login.

- **GET /google/callback**  
  Handles the Google OAuth callback and provides a JWT token.

### Article Routes (article)
- `GET /all`: Get all articles
- `GET /tag`: Get articles by tag
- `GET /detail/:id`: Get article by ID
- `GET /search`: Search articles
- `GET /popular`: Get popular articles
- `GET /category/:categoryOrTag`: Get articles by category or tag

### Journalist Routes (journalist)
- `GET /articles`: Get articles written by the journalist
- `POST /articles`: Create a new article
- `PUT /articles/:id`: Update an existing article
- `GET /status`: Get under review articles
- `GET /articles/:id`: Get article by ID

### User Routes (user)
- `POST /:articleId/bookmark`: Add an article to bookmarks
- `DELETE /:articleId/bookmark`: Remove an article from bookmarks
- `GET /article`: Get bookmarked articles
- `POST /:articleId/comments`: Add a comment to an article
- `GET /:articleId/comments`: Get comments for an article
- `DELETE /:articleId/comments/:commentId`: Delete a comment

### Admin Routes (admin)
- `GET /articles`: Get all articles
- `GET /articles/:id`: Get article by ID
- `PATCH /articles/:articleId/publish`: Publish an article
- `PATCH /articles/:articleId/unpublish`: Unpublish an article
- `PATCH /users/:userId/role`: Update user role
- `DELETE /articles/:id`: Delete an article
- `GET /search`: Search articles
- `GET /users`: Get all users
- `DELETE /users/delete/:userId`: Delete a user
- `PATCH /users/role/:userId`: Update user role
- `GET /users/role/:role`: Get users by role

## Technologies Used
- **Express** for the backend framework
- **JWT** for authentication
- **MongoDB** for database (if applicable)
