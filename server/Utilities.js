const axios = require('axios');
const readGateWay = require('./ApiGateway');
//exports a set of useful utilites to be used by server

class Utilities {
  constructor(readURL) {
    this.readGateWay = new readGateWay(readURL);
  }
  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  makeConfig(data, method, url, isDryRun=false, tokenName, token) {
    let config = {
      method : method,
      url : url,
      headers : {
        'Content-Type'  : 'application/json',
        'Cookie'        : token + "=" + tokenName,
        'X-Client'      : 'fvv-server',
        'X-NVDB-DryRun' : isDryRun
      },
      data : data,
    }
    return config;
  }

  makeDateStr() {
    let d = new Date();
    let date = d.getDate();
    let month = d.getMonth()+1;

    if (date < 10) {
      date = "0" + date;
    }

    if (month < 10) {
      month = "0" + month;
    }
    return d.getFullYear() + "-" + month + "-" + date;
  }

  calcPollingInterval(timeMS=1000, startedProcess) {
      if (startedProcess) {
        return timeMS * 60 + 1000;
      } else {
        return timeMS + 1000;
      }
  }

  async pollProgress(config) {
    let startedProcess = false;
    let statusProgress;
    let isDone = false;
    let response;
    let timesPolled = 0;
    let waitingTime;

    while(!isDone) {
      response = await axios(config);
      statusProgress = response.data;
      console.log(statusProgress);
      switch(statusProgress) {
        case "IKKE STARTET" :
          console.log("NOT STARTED");
          break;

        case "BEHANDLES" :
        console.log("PROCESSING");
          startedProcess = true;
          waitingTime = (timesPolled * 1) + 1000;
          timesPolled+=1;
          await this.sleep(waitingTime);
          break;

        case "VENTER" :
          console.log("WAITING");
          if(startedProcess) {
            waitingTime = (timesPolled * 1) + 60000; //wait >=1min if processing has begun
          } else {
            waitingTime = (timesPolled * 1) + 1000;
          }
          timesPolled+=1;
          await this.sleep(waitingTime);
          break;

        case "AVVIST" :
          console.log("REJECTED");
          isDone = true;
          break;

        case "UTFØRT" :
          console.log("COMPLETED");
          isDone = true;
          break;

        case "UTFØRT_OG_ETTERBEHANDLET" :
          console.log("COMPLETED AND POSTPROCESSED");
          isDone = true;
          break;

        case "KANSELLERT":
          console.log("CANCELLED");
          isDone = true;
          break;

        default:
          throw "Invalid value of response: " + response.data;
      }
    }
    return response;
  }
}

module.exports = Utilities;
