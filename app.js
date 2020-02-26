const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet')
const MOVIES = require('./movies.json');
const cors = require('cors');
const PORT = 8000;
const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.AUTH;
    const authToken = req.query.auth;
  
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
      return res.status(401).send({ error: `api: ${apiToken} auth: ${authToken}` });
    }
    // move to the next middleware
    next()
  });

  app.get('/movies', (req, res) => {
    let response = [];
    const { type, search } = req.query;

    if (!search) {
        return res
        .status(400)
        .send("Must supply a search query.");
    }

    if (!type) {
        return res
        .status(400)
        .send("Must supply a type of search to perform, choose genre, country, or rating.");
    }

    if (type === "genre") {
        if (isNaN(search) !== true) {
            return res
            .status(400)
            .send("You must enter a string value when doing a genre search");
        }
        response = MOVIES.map(movie => {
            if (movie.genre.toLowerCase() === search.toLowerCase()) return movie;
        });
    }

    if (type === "country") {
        if (isNaN(search) !== true) {
            return res
            .status(400)
            .send("You must enter a string value when doing a country search");
        }
        response = MOVIES.map(movie => {
            if (movie.country.toLowerCase() === search.toLowerCase()) return movie;
        });
    }

    if (type === "rating") {
        if (isNaN(search)) {
            return res
            .status(400)
            .send("You must enter a numeric value when doing a rating search");
        }
        response = MOVIES.map(movie => {
            if (movie.avg_vote >= search) return movie;
        });
    }

    res.json(response.filter(elem => {return elem != null}));
  });

module.exports = app;

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
})