<h1 align="center">Bibliotheca</h1>
<h3 align="center">Simple, secure and ready for production library managment system.</h3>

---

<div align="center">
<img alt="Logo Banner" src="./transparent.png"/>
</div>

---

Bibliotheca is a full-featured Library Management System designed to simplify the borrowing process for readers and give administrators powerful tools to manage their collections.

## Technologies

- Node, Express for the server code
- Prisma, Postgres -> Maybe should switch to MySQL since the application is mostly reading operations.
- Docker-Compose and Jest

## API Design

### Authentication

- **POST** `/api/v1/auth/signup` [PUBLIC]
  Register a new user account.

- **POST** `/api/v1/auth/login` [PUBLIC]
  Authenticate with email and password, returns a JWT token.

---

### Books

- **GET** `/api/v1/books?page=1&search=term` [AUTHENTICATED]
  Retrieve a paginated list of all available books. Supports query params for pagination and filtering.

- **POST** `/api/v1/books` [ADMIN]
  Add a new book to the catalog (title, author, category, location, etc.).

- **PUT** `/api/v1/books/:id` [ADMIN]
  Update details of an existing book (metadata, availability, etc.).

- **DELETE** `/api/v1/books/:id` [ADMIN]
  Permanently remove a book from the catalog.

---

### Borrowings

- **GET** `/api/v1/borrowings?page=1&status=OVERDUE` [ADMIN]
  Retrieve a list of all borrowings, filtered by status

- **GET** `/api/v1/borrowings/reports?fromDate=2025-05-01&toDate=2025-09-01` [ADMIN]
  Generate borrowing analytics reports for a given date range (e.g., total borrows, returns, overdue counts).

- **GET** `/api/v1/borrowings/me?page=1` [AUTHENTICATED]
  Retrieve the current user’s borrowing history with pagination.

- **POST** `/api/v1/borrowings/` [AUTHENTICATED]
  Borrow a book (creates a borrowing record with due date).

- **PATCH** `/api/v1/borrowings/:borrowingId/return` [AUTHENTICATED]
  Mark a book as returned by the current user.

## Database Design

View database diagram on [dbdiagram.io](https://dbdiagram.io/d/68d312f27c85fb996108d5fc)

---

## How to Run

### Environment Setup

This project uses environment variables for configuration.

- For **development**, use `.env.dev` (optimized for Nodemon & hot-reload).
- For **production**, use `.env`.

You can create one quickly by copying the example:

```bash
cp .env.example .env.dev   # for development
cp .env.example .env       # for production
```

---

### Running with Docker

Make sure you have **Docker** and **Docker Compose** installed.

#### Development (with hot reload)

```bash
docker compose --env-file .env.dev up --build
```

#### Production

```bash
docker compose --env-file .env up --build -d
```

---

Once containers are running, the API will be available at:

```
http://localhost:<PORT>
```
