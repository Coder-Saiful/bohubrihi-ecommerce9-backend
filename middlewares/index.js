const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');

module.exports = (app) => {
    app.use(compression());
    app.use(cors());
    app.use(express.json());
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }
}