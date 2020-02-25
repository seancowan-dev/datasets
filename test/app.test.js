const app = require('../app');
const expect = require('chai').expect;
const supertest = require('supertest');

describe('GET /movies', () => {
    it('Should return 401 if Authorization token is invalid', () => {
        return supertest(app)
        .get(`/movies?auth=Bearer 72833bc1-5805-00ea-8e2d-1242ac031113`) // This is an invalid token
        .expect(401)
    });

    it('Should return 400 if no search query is provided', () => {
        return supertest(app)
        .get(`/movies?auth=Bearer 72833bc0-5815-11ea-8e2d-0242ac130003&type=genre`)
        .expect(400)
    });

    it('Should return 400 if no search type is provided', () => {
        return supertest(app)
        .get(`/movies?auth=Bearer 72833bc0-5815-11ea-8e2d-0242ac130003&search=japan`)
        .expect(400)
    });

    it('Should return 400 if no params are provided', () => {
        return supertest(app)
        .get(`/movies?auth=Bearer 72833bc0-5815-11ea-8e2d-0242ac130003`)
        .expect(400)
    });
});