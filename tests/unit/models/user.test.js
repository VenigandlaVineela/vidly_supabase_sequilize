const { generateAuthToken } = require('../../../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');

describe('generateAuthToken', () => {

  it('should return a valid JWT', () => {

    const payload = {
      id: 1,
      isAdmin: true
    };

    const token = generateAuthToken(payload);

    const decoded = jwt.verify(
      token,
      config.get('jwtPrivateKey')
    );

    expect(decoded).toMatchObject(payload);

  });

});
