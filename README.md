# Library API

## Project Overview

Library API is a RESTful backend service for managing a collection of books and user authentication. It allows users to register, log in, and manage their own books. The API is built with NestJS and uses Prisma ORM to interact with a MongoDB database. Authentication is handled using JWT tokens with refresh token support.

## Technology Stack

- **Node.js** (JavaScript/TypeScript runtime)
- **NestJS** (Backend framework)
- **Prisma ORM** (Database ORM)
- **MongoDB** (Database)
- **JWT** (Authentication)
- **bcryptjs** (Password hashing)
- **class-validator** & **class-transformer** (DTO validation)
- **Passport.js** (Authentication middleware)
- **ESLint** & **Prettier** (Code quality and formatting)

## Setup Instructions

1. **Clone the repository**
   ```sh
   git clone https://github.com/AkshatK6971/LibraryAPI.git
   cd LibraryAPI
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory with the following content (update values as needed):

   ```
   DATABASE_URL="your-mongodb-connection-string"
   JWT_SECRET=your-jwt-secret
   JWT_REFRESH_SECRET=your-jwt-refresh-secret
   ```

4. **Generate Prisma client**
   ```sh
   npx prisma generate
   ```

5. **(Optional) Seed the database**
   ```sh
   node prisma/populatedb.js
   ```

6. **Run the application**
   - Development mode (with hot reload):
     ```sh
     npm run start:dev
     ```
   - Production mode:
     ```sh
     npm run build
     npm run start:prod
     ```

7. **API will be available at** `http://localhost:3000`

## Features

- **User Registration & Login**
  - Secure registration and login with hashed passwords.
  - JWT-based authentication with refresh token support.

- **Book Management**
  - Create, read, update, and delete books.
  - Each book is associated with a user.
  - Only the owner can update or delete their books.

- **Validation & Error Handling**
  - DTO validation using class-validator.
  - Proper error responses for forbidden actions and not found resources.

- **Prisma ORM Integration**
  - MongoDB database access via Prisma.
  - Easy schema management and migrations.

## API Documentation

### User Endpoints

#### Register

- **POST** `/users/register`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```
- **Response:** 
   ```json
   {
      "accessToken": "accessToken",
      "refreshToken": "refreshToken"
   }
   ```

#### Login

- **POST** `/users/login`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```
- **Response:** JWT access and refresh tokens

> The following endpoints require the `Authorization: Bearer <accessToken>` header.
#### Logout

- **GET** `/users/logout`
- **Response:** 
   ```json
   {
      "id": "user-id",
      "email": "user@example.com",
      "refreshToken": null
   }
   ```

#### Info

- **GET** `/users/info`
- **Response:**
   ```json
   {
      "id": "user-id",
      "email": "user@example.com"
   }
   ```

#### Refresh Token
> This endpoint requires the `Authorization: Bearer <refreshToken>` header.
- **GET** `/users/refresh`
- **Response:** New access and refresh tokens

---

### Book Endpoints
#### Get All Books

- **GET** `/books`
- **Response:** Array of books

#### Get Book by ID

- **GET** `/books/:id`
- **Response:** 
   ```json
   {
     "id": "book-id",
     "title": "Book Title",
     "author": "Author Name",
     "genre": "Book Genre",
     "pages": "number of pages",
     "userId": "user-id"
   }
   ```

> The following endpoints require the `Authorization: Bearer <accessToken>` header. Only the books created by the respective user can be updated or deleted by them.
#### Create Book

- **POST** `/books/create`
- **Body:**
  ```json
  {
    "title": "Book Title",
    "author": "Author Name",
    "genre": "Book Genre",
    "pages": "number of pages"
  }
  ```
- **Response:** Created book object

#### Update Book

- **PATCH** `/books/:id`
- **Body:** (any or all fields)
  ```json
  {
    "title": "Book Title",
    "author": "Author Name",
    "genre": "Book Genre",
    "pages": "number of pages"
  }
  ```
- **Response:** Updated book object

#### Delete Book

- **DELETE** `/books/:id`
- **Response:** Array of books after deletion of respective book

---

## Challenges & Solutions

- **Challenge:** Securely storing and validating refresh tokens.
  - **Solution:** Refresh tokens are hashed before storing in the database. On refresh, the provided token is compared using bcrypt to prevent token leakage.

- **Challenge:** Ensuring only book owners can modify or delete their books.
  - **Solution:** Ownership checks are implemented in the service layer before allowing updates or deletions.

- **Challenge:** DTO validation and transformation.
  - **Solution:** Used `class-validator` and `class-transformer` with NestJS's global validation pipe to enforce input validation.

- **Challenge:** Managing environment variables securely.
  - **Solution:** Used `@nestjs/config` to load and manage environment variables.

## Future Enhancements

- **API Documentation:** Add Swagger/OpenAPI documentation for easier API exploration.
- **Pagination & Filtering:** Implement pagination and filtering for book listings.
- **User Roles:** Add support for admin roles and permissions.
- **Unit & Integration Tests:** Expand test coverage for all modules and endpoints.
- **Rate Limiting:** Add rate limiting to prevent abuse.
- **Dockerization:** Provide Docker support for easier deployment.
- **Frontend Integration:** Build a frontend client for interacting with the API.

---