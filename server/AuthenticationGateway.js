const axios = require('axios');
const utilities = require('./Utilities')
const utils = new utilities();
//export functions to handle authentication requests

class AuthenticationGateway {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  async getToken(username, password) {
    let data = {'username' : "nesarune", 'password' : "4TSZxq63"}
    let config = utils.makeConfig(data, 'post', this.endpoint + 'autentiser')
    let res = await axios(config);

    let token = res.data.token;
    let tokenName = res.data.tokenname;
    let isAuthenticated = res.data.status;

    let loginObject = {
      token : token,
      isAuthenticated : isAuthenticated,
      tokenName : tokenName,
    }
    return loginObject;
  }

  async invalidateToken(token) {
    let data = { token };
    let config = utils.makeConfig(data, 'post', this.endpoint + 'logout');
    let res = await axios(config);
    return res;
  }
}

module.exports = AuthenticationGateway;
