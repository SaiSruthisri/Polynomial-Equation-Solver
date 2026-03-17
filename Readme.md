# Polynomial Solver

This project is a Node.js and Express web application for evaluating polynomial and algebraic expressions entered by the user.

The app uses math.js to:

- parse the expression
- detect which variables are present
- evaluate the final result after the user provides values

The frontend is rendered with EJS and currently keeps the full interaction on the home page:

1. The user enters an expression.
2. The user clicks Detect Variables.
3. The app finds symbols such as x, y, a, b, c, or d.
4. Input fields are generated for those detected variables.
5. The user enters values and clicks Solve.
6. The result is shown on the same page.

## Current Status

MongoDB support is present in the codebase but is currently on hold.

- Environment loading with dotenv is enabled.
- Mongoose model code exists.
- Database connection and save logic are intentionally commented out for now.

This means the app currently works as a frontend plus expression-solving backend without database persistence.

## Tech Stack

- Node.js
- Express
- EJS
- math.js
- dotenv
- Mongoose

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
├── Readme
└── server.js
```

## Main Files

### server.js

Application entry point.

- configures Express
- loads environment variables
- serves static files
- sets EJS as the view engine
- mounts polynomial routes
- starts the server on port 3000

### controllers/polynomialController.js

Contains the main app logic.

- showForm: renders the home page
- detectVariables: parses the expression and extracts variable names
- solveExpression: evaluates the expression using user-provided values

### routes/polynomial.js

Defines the application routes.

- GET / : home page
- POST /variables : detect variables from the expression
- POST /solve : evaluate the expression

### views/index.ejs

Main frontend page where users:

- type the expression
- click Detect Variables
- enter values for detected variables
- click Solve to view the result on the same page

### public/script.js

Handles frontend interaction.

- sends the expression to the backend for variable detection
- dynamically creates input fields for detected variables
- submits the solve request using fetch
- updates the result area without leaving the page

## How Variable Detection Works

Variable detection is handled with math.js parsing.

Example expression:

```text
a^2 + b*c + d
```

The backend parses the expression tree and extracts symbol nodes. Reserved constants and function names are ignored.

Detected variables for the above expression:

```text
a, b, c, d
```

This is more reliable than hardcoding fields like x and y.

## How Solving Works

After variable detection, the user enters values for all detected variables.

Example:

```text
Expression: x^2 + y*3 + 3
Inputs: x = 2, y = 4
Result: 19
```

The backend evaluates the expression using:

```js
math.evaluate(expression, inputs)
```

## Installation

Install dependencies:

```bash
npm install
```

## Run the App

Start the server:

```bash
npm start
```

Then open:

```text
http://localhost:3000
```

## Environment Variables

You can keep a .env file in the project root.

Example:

```env
MONGODB_URI=your_mongodb_connection_string
```

At the moment, MongoDB is not active because the connection code is commented out.

## API Routes

### GET /

Renders the home page.

### POST /variables

Accepts an expression and returns detected variables.

Example request body:

```text
expression=x^2+y*3+3
```

Example response:

```json
{
    "expression": "x^2+y*3+3",
    "variables": ["x", "y"]
}
```

### POST /solve

Accepts the expression and the variable values, then returns the evaluated result.

Example request body:

```text
expression=x^2+y*3+3&x=2&y=4
```

Example response:

```json
{
    "expression": "x^2+y*3+3",
    "inputs": {
        "x": 2,
        "y": 4
    },
    "result": 19
}
```

## Notes

- The app currently supports dynamic variables instead of fixed x and y inputs.
- The result is displayed on the same page.
- MongoDB model files remain in place for future persistence support.
- If database support is re-enabled later, the saved expression, inputs, and result can be stored in MongoDB.

## Future Improvements

- Re-enable MongoDB persistence with a feature flag
- Preserve user-entered variable values when expression changes
- Add stronger validation for missing or invalid inputs
- Improve result formatting and error messages
- Support more advanced math functions in the UI
