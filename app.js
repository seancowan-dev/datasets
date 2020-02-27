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
    const authToken = req.headers.authorization;
  
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
      return res.status(401).send({ error: `api: ${apiToken} auth: ${authToken}` });
    }
    // move to the next middleware
    next()
  });

  app.get('/movies', (req, res) => {
    let response = [];
    const { genre, country, rating, search } = req.query;

    if (!genre && !country && !rating && !search) {
        return res
        .status(400)
        .send("Cannot search without any query parameters.");
    }

    if (search) {
        if (isNaN(search !== true)) {
            return res
            .status(400)
            .send("You must enter a string value when doing a title search");
        }
        response = MOVIES.filter(movie => {
            return movie.film_title.toLowerCase().includes(search.toLowerCase());
        })
    }

    if (genre) {
        if (isNaN(genre) !== true) {
            return res
            .status(400)
            .send("You must enter a string value when doing a genre search");
        }
        if (response.length > 0) {
        response = response.filter(movie => {
            return movie.genre.toLowerCase() === genre.toLowerCase();
        }); 
        } else {
        response = MOVIES.filter(movie => {
            return movie.genre.toLowerCase() === genre.toLowerCase();
        });
        }
    }

    if (country) {
        if (isNaN(country) !== true) {
            return res
            .status(400)
            .send("You must enter a string value when doing a country search");
        }
        if (response.length > 0) {
        response = response.filter(movie => {
            return movie.country.toLowerCase() === country.toLowerCase();
        });
        } else {
        response = MOVIES.filter(movie => {
            return movie.country.toLowerCase() === country.toLowerCase();
        });
        }

    }

    if (rating) {
        if (isNaN(rating)) {
            return res
            .status(400)
            .send("You must enter a numeric value when doing a rating search");
        }
        if (response.length > 0) {
        response = response.filter(movie => {
            return movie.avg_vote >= rating;
        });
        } else {
        response = MOVIES.filter(movie => {
            return movie.avg_vote >= rating;
        });
        }
    }

    res.json(response);
  });

module.exports = app;

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
})