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
let isAuthenticated;
// getToken();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/login', async(req, res) =>{
  let username = req.body[0];
  let password = req.body[1];
  console.log(username + ", " + password);
  await getToken(username, password);
  res.send(isAuthenticated);
});

// async function

async function getToken(username, password) {
  let config = {
    method : 'post',
    // url : 'https://www.vegvesen.no/ws/no/vegvesen/ikt/sikkerhet/aaa/autentiser',
    url : 'http://localhost:8010/ws/no/vegvesen/ikt/sikkerhet/aaa/autentiser',
    headers : {
      'Content-Type' : 'application/json'
    },
    data : {
      'username' : username,
      'password' : password
    }
  }

  try {
    let res = await axios(config);
    console.log(res);
    token = res.data.token;
    tokenName = res.data.tokenname;
    isAuthenticated = res.data.status;
    console.log(token);
    console.log(tokenName);
  } catch(error) {
    console.log("Error occurred when getting token: " + error);
  }
}

app.post('/api/getroadobjecttypes', (req, res) => {
    nvdb.apiCallSingle(req.body.request).then(data => {res.send(data)}).catch(e => {console.log(e)})
});

app.post('/api/getroadobjects', (req, res) => {
  nvdb.apiCall(req.body.request).then(data => {res.send(data)}).catch(e => {console.log(e)})
});

app.post('/getCatalogueVersion', async (reg, res) => {
  try {
    let catalogueVersion = await nvdb.apiCallSingle('vegobjekttyper/version');
    console.log(catalogueVersion);
  }
  catch (error) {
    console.log("Error when getting catalogue version: " + error);
  }
});


app.post('/registerNewObject', async (req, res) => {
  let objectData = req.body[0];
  let objectCoords = req.body[1];
  try {
    let closestRoad = await nvdb.apiCallSingle('posisjon?lat=' + objectCoords.lat + '&lon=' + objectCoords.lng);
    objectData.registrer.vegobjekter[0].stedfesting.punkt[0].posisjon = closestRoad[0].veglenkesekvens.relativPosisjon; //dig through objects to set relative position
    objectData.registrer.vegobjekter[0].stedfesting.punkt[0].veglenkesekvensNvdbId = closestRoad[0].veglenkesekvens.veglenkesekvensid; //dig through objects to set proper nvdb road ID
  }
  catch (error) {
    console.log("Error when getting closest road properties: " + error);
  }

  let currentDateStr = formatDateStr()
  console.log(currentDateStr);

  objectData.registrer.vegobjekter[0].gyldighetsperiode.startdato = currentDateStr;
  console.log(objectData.registrer.vegobjekter);
  if (token !== undefined && tokenName !== undefined) {
    let config = {
      method : 'post',
      url : 'http://localhost:8010/nvdb/apiskriv/rest/v3/endringssett',
      headers : {
        'Content-Type'  : 'application/json',
        'Cookie'        : tokenName + '=' + token,
        'X-Client'      : 'fvv-sysytem',
        'X-NVDB-DryRun' : false,
      },
      data : objectData
    }

    let responseChangeSet = await registerChangeSet(config);
    // console.log(responseChangeSet);
    // config.method = 'post';
    config.url = responseChangeSet.data[1].src;
    delete config["data"];
    let command = responseChangeSet.data[1].rel;

    let startResponse = await postCommand(config, command);
    // console.log(startResponse.data);

    config.method = 'get';
    config.url = startResponse.data[0].src;
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

function formatDateStr() {
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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//
/*
* Poll progress of changeset
* Polling time intervals is loosley based on recommendations found at
* https://apiskriv.vegdata.no/endringssett/introduksjon
*/
async function pollProgress(config) {
  try {
    let startedProcess = false;
    let statusProgress;
    let isDone = false;
    let response;
    let timesPolled = 0;
    let waitingTime;

    while(!isDone) {
      response = await axios(config);
      statusProgress = response.data;
      switch(statusProgress) {
        case "IKKE STARTET" :
          console.log("NOT STARTED");
          break;

        case "BEHANDLES" :
        console.log("PROCESSING");
          startedProcess = true;
          waitingTime = (timesPolled * 1) + 1000;
          timesPolled+=1;
          await sleep(waitingTime);
          break;

        case "VENTER" :
          console.log("WAITING");
          if(startedProcess) {
            waitingTime = (timesPolled * 1) + 60000; //wait >=1min if processing has begun
          } else {
            waitingTime = (timesPolled * 1) + 1000;
          }
          timesPolled+=1;
          await sleep(waitingTime);
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
