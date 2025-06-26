# Tododo

**Tododo** - a simple Node.js todo app with a RESTful API and view.

## Installation

1. Clone the repository:
    ```
     git clone
     cd tododo
    ```
2. Install dependencies:
    ```
     npm install
    ```
3. setup the environment variables based on [env.example file](.env.example):
4. Run the application:
    ```
     npm start
    ```
5. Open your browser and navigate to `http://localhost:<PORT>`.

## Features

- User registration and login
    - Authentication using Session
    - Account activation via email
    - Password reset functionality
- CRUD operations for todos
- RESTful API for todos (see examples in [tests](tests/))
- View for displaying todos

## Dependencies

- **Express** - Web framework for Node.js
- **Mongoose** - MongoDB ODM for Node.js
- **EJS** - Templating engine for rendering views
- **Passport** - Authentication middleware for web servers

---

Created for educational purposes.
