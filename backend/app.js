const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const {ValidationError} = require('sequelize');

const {environment} = require('./config');
const isProduction = environment === 'production';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Security Middleware
if (!isProduction) {
    app.use(cors());
}

// helmet helps set the headers for better security
app.use(
    helmet.crossOriginResourcePolicy({
        policy: "cross-origin"
    })
);

// Set the _csrf token and create req.csrfToken method
app.use(
    csurf({
        cookie: {
            secire: isProduction,
            sameSite: isProduction && 'Lax',
            httpOnly: true
        }
    })
);

// Connect to routes
app.use(routes);

// Catch unhandled requested and forward to error handler
app.use((_req, _res, next) => {
    const err = new Error("The requested resource couldn't be found");
    err.title = "Resource Not Found";
    err.errors = ["The requested resource couldn't be found"];
    err.status = 404;
    next(err);
});

// Process Sequelize errors
app.use((err, _req, _res, next) => {
    if (err instanceof ValidationError) {
        err.errors = err.errors.map((e) => e.message);
        err.title = 'Validation error';
    }
    next(err);
});

// Error formatter
app.use((err, _req, res, _next) => {
    res.status(err.status || 500);
    console.error(err);
    res.json({
        title: err.title || 'Server Error',
        message: err.message,
        errors: err.errors,
        stack: isProduction ? null : err.stack
    })
})

module.exports = app;