# Polynomial Solver

## About

A web app that detects variables from a polynomial or algebraic expression and computes the result from user-provided values.

## Tech Stack

- Node.js: JavaScript runtime used to run the backend server.
- Express: Web framework used for routes and request handling.
- EJS: Templating engine used to render the frontend page.
- math.js: Used to parse expressions, detect variable symbols, and evaluate results.
- dotenv: Loads environment variables from the .env file.
- Mongoose: Included for MongoDB integration (currently kept on hold in code).

## Project Structure

```text
Web/
├── controllers/
│   └── polynomialController.js
├── models/
│   └── equation.js
├── public/
│   ├── script.js
│   └── style.css
├── routes/
│   └── polynomial.js
├── views/
│   ├── index.ejs
│   └── result.ejs
├── .env
├── package.json
├── Readme.md
└── server.js
```

## Setup

1. Install dependencies.

```bash
npm install
```

2. Start the server.

```bash
npm start
```

3. Open in browser.

```text
http://localhost:3000
```
