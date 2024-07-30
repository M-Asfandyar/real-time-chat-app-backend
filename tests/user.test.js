const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index'); // Adjust this path based on your project structure

const { expect } = chai;
chai.use(chaiHttp);

describe('User API', () => {
    describe('POST /api/users/register', () => {
        it('should register a new user', (done) => {
            chai.request(app)
                .post('/api/users/register')
                .send({ username: 'testuser', password: 'password' })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('token');
                    done();
                });
        });
    });

    describe('POST /api/users/login', () => {
        it('should login an existing user', (done) => {
            chai.request(app)
                .post('/api/users/login')
                .send({ username: 'testuser', password: 'password' })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('token');
                    done();
                });
        });
    });
});
