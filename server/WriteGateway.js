//export handy functions to simplify writing to NVDB
let utilities = require('./utilities')
const utils = new utilities();
const axios = require('axios');

class WriteGateway {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  async writeObject(data) {

  }

  /*
  * Send changeset with objectdata, return set of commands
  */
  async registerChangeset(data, url, isDryRun, tokenName, token) {
    let config = utils.makeConfig(data, 'post', url, isDryRun, tokenName, token);
    console.log(config);
    let response = await axios(config);
    console.log("RESPONSE IS " + response.data);

    let commands = {
      self              : response.data[0].src,
      start             : response.data[1].src,
      kanseller         : response.data[2].src,
      status            : response.data[3].src,
      fremdrift         : response.data[4].src,
      fremdriftOgÅrsak  : response.data[5].src
    }

    return commands;
  }

  /*
  * Run command received from changeset against NVDB, return status query options
  */
  async giveCommand(commandURL) {
    let config = utils.makeConfig(null, 'post', commandURL);
    let response = await axios(config);

    let statusQueryOptions = {
      fremdrift         : response.data[0].src,
      fremdriftOgÅrsak  : response.data[1].src,
      status            : response.data[2].src,
      self              : response.data[3].src,
    }

    return statusQueryOptions;
  }

  /*
  * Query NVDB about given status of writing process, return status objects
  */
  async queryProgress(queryURL) {
    let config = utils.makeConfig(null, 'get', queryURL)
    let response = await axios(config);
    return response.data;
  }

  /*
  * Read status data from queries
  */
  async getQueryStatusData() {

  }
}

module.exports = WriteGateway;
