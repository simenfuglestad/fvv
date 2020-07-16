const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const apiGateway = require('./ApiGateway');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

//set limit for accepted filesize
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

//intercept all outgoing requests for logging purposes
axios.interceptors.request.use(function (config) {
  // console.log(config)
  return config;
}, function (error) {
  return Promise.reject(error);
});

const nvdb = new apiGateway("https://nvdbapiles-v3.atlas.vegvesen.no/")

let token;
let tokenName;
getToken();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


async function getToken() {
  let config = {
    method : 'post',
    url : 'http://localhost:8010/ws/no/vegvesen/ikt/sikkerhet/aaa/autentiser',
    headers : {
      'Content-Type' : 'application/json'
    },
    data : {
      'username' : 'ap',
      'password' : 'ap'
    }
  }

  try {
    let res = await axios(config);
    token = res.data.token;
    tokenName = res.data.tokenname;
  } catch(error) {
    console.log("Error occurred when getting token: " + error);
  }
}

app.post('/testRegNyttObjekt', async (req, res) => {
  if (token !== undefined && tokenName !==undefined) {
    let config = {
      method : 'post',
      url : 'http://localhost:8010/nvdb/apiskriv/rest/v3/endringssett',
      headers : {
        'Content-Type'  : 'application/json',
        'Cookie'        : tokenName + '=' + token,
        'X-Client'      : 'fvv-sysytem',
        'X-NVDB-DryRun' : true,
      },
      data : req.body
    }

    let responseChangeSet = await registerChangeSet(config);
    config.method = 'post';
    config.url = responseChangeSet.data[1].src;

    config.data = null;
    console.log(config);
    delete config["data"];
    let command = responseChangeSet.data[1].rel;
    let startResponse = await postCommand(config, command);
    console.log(startResponse.data);

    config.method = 'get';
    config.url = startResponse.data[0].src;
    console.log(config);
    let statusProgress;
    try {
      let doneStatus = await pollProgress(config);
      console.log(doneStatus.data);
    }
    catch (error) {
      console.log(error);
    }

  }
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//implement polling calculation to be used by pollProgress here
function calcPollingTime(timesPolled, startedProcess) {

}

async function pollProgress(config) {
  try {
    let startedProcess = false;
    let statusProgress;
    let isDone = false;
    let response;
    let timesPolled = 0;

    let waitMS; //time to wait between polling in milliseconds

    while(!isDone) {
      response = await axios(config);
      waitMS = (timesPolled + 1) + 1000; //replace with calcPollingTime(timesPolled, startedProcess)
      await sleep(waitMS);
      switch(response.data) {
        case "IKKE STARTET" :
          console.log("NOT STARTED");
          break;
        case "BEHANDLES" :
          startedProcess = true;
          timesPolled+= 1;
          console.log("STILL PROCESSING");
          break;
        case "VENTER" :
          console.log("WAITING");
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
  catch (error) {
    console.log("Error in pollProgress: \n" + error);
  }
}

async function postCommand(config, command) {
  try {
    let response = await axios(config);
    return response;
  }
  catch (error) {
    console.log("Error response postCommand: \n" + error);
  }
}

async function registerChangeSet(config) {
  try {
    let response = await axios(config);
    return response;
  }
  catch (error) {
    console.log("Error response registerChangeSet: \n" + error);
  }
}


//test av innsending av endringssett til docker
app.post('/testendring', (req, res) => {
  axios.post(
  'http://localhost:8010/nvdb/apiskriv/rest/v3/endringssett',
  data = req.body,
  config = {headers: {Cookie : tokenName + '=' + token, 'X-Client': 'NavnPåDinKlient'}})
  .then(response => {
    axios.post(
    response.data[1].src,
    {},
    config = {headers: {Cookie : tokenName + '=' + token, 'X-Client': 'NavnPåDinKlient'}})
    .then(async response => {
      let status = 'BEHANDLES'
      while (status === 'BEHANDLES') {
        let framdrift = await axios.get(
          response.data[0].src,
          config = {headers: {Cookie : tokenName + '=' + token, 'X-Client': 'NavnPåDinKlient'}})

        status = framdrift.data
        console.log(status)
      }
      res.send(status)
  })
})
.catch(error => {
  console.log('error')
console.log(error);
});

})

app.post('/api/getroadobjecttypes', (req, res) => {
    nvdb.apiCallSingle(req.body.request).then(data => {res.send(data)}).catch(e => {console.log(e)})

});

app.post('/api/getroadobjects', (req, res) => {
  nvdb.apiCall(req.body.request).then(data => {res.send(data)}).catch(e => {console.log(e)})

});

app.post('/registerCase', (req, res) => {
  const fs = require("fs");
  const cases = require("./data.json");

  console.log(req.body)
  if(req.body.id !== undefined){
    let index = cases.findIndex(curCase =>(curCase.id === req.body.id));
    cases[index] = req.body;
  } else {
    let ids = [];
    let id = cases.length;
    cases.forEach(element => {
      ids.push(element.id)
    });
    while (ids.includes(id)) {
      id += 1
    }

    req.body['id'] = id;
    cases.push(req.body);
  }


  // STEP 3: Writing to a file
  fs.writeFile("data.json", JSON.stringify(cases), err => {

    // Checking for errors
    if (err) throw err;

    console.log("Done writing"); // Success
  });

  res.send('success')
});

app.get('/getCaseList', (req,res) => {
  const cases = require('./data.json')

  res.send(cases)
})

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, '../client/build')));
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
