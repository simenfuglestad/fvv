const utilities = require('./Utilities');
const authentication = require('./AuthenticationGateway');
const readGateway = require('./ReadGateway');
const writeGateway = require('./WriteGateway')
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
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

let changesetURL = "https://www.test.vegvesen.no/nvdb/apiskriv/rest/v3/endringssett";

const utils = new utilities();
const auth = new authentication("https://www.test.vegvesen.no/ws/no/vegvesen/ikt/sikkerhet/aaa/");
const rdGateway = new readGateway("https://nvdbapiles-v3.atlas.vegvesen.no/")
const wrGateway = new writeGateway(changesetURL);

let token = null;
let tokenName = null;
let isAuthenticated = false;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/login', async(req, res) =>{
  let username = req.body[0];
  let password = req.body[1];
  try {
    let loginObject = await auth.getToken(username, password);
    token = loginObject.token;
    tokenName = loginObject.tokenName;
    res.send(loginObject.isAuthenticated);
  }
  catch(error) {
    res.send(false);
    console.log("An error occurred when logging in: " + error);
  }
});

app.post('/logout', async(req, res) => {
  try {
    let logout = await auth.invalidateToken(token)
    isAuthenticated = false;
    token = null;
    tokenName = null;
    res.send(isAuthenticated);
  }
  catch (error) {
    console.log("Error occurred when invalidating token: " + error);
  }
})

app.post('/api/getroadobjecttypes', (req, res) => {
    rdGateway.getSingleNVDBObject(req.body.request).then(data => {res.send(data)}).catch(e => {console.log(e)})
});

app.post('/api/getroadobjects', (req, res) => {
  rdGateway.getNVDBObject(req.body.request).then(data => {res.send(data)}).catch(e => {console.log(e)})
});

app.post('/getCatalogueVersion', async (reg, res) => {
  try {
    let catalogueVersion = await rdGateway.getSingleNVDBObject('vegobjekttyper/version');
    console.log(catalogueVersion);
  }
  catch (error) {
    console.log("Error when getting catalogue version: " + error);
  }
});


app.post('/pollRegisterStatus', async (req, res) => {
  console.log(req.data);
  // let done = false;
  // while(!done){
  //   let status = await queryProgress(statusQueryOptions.fremdrift);
  //   if (status.includes("UTFØRT") || status.includes("AVVIST")) {
  //     done = true;
  //     res.send("Registrering avsluttet med status" + status);
  //   } else if(status.includes("BEHANDLES")) {
  //
  //   }
});

app.post('/initRegObj', async (req, res) => {
  let objectData = req.body[0];
  let objectCoords = req.body[1];
  try {
    const closestRoad = await rdGateway.getSingleNVDBObject('posisjon?lat=' + objectCoords.lat + '&lon=' + objectCoords.lng);
    objectData.registrer.vegobjekter[0].stedfesting.punkt[0].posisjon = closestRoad[0].veglenkesekvens.relativPosisjon; //dig through objects to set relative position
    objectData.registrer.vegobjekter[0].stedfesting.punkt[0].veglenkesekvensNvdbId = closestRoad[0].veglenkesekvens.veglenkesekvensid; //dig through objects to set proper nvdb road ID

    const currentDateStr = utils.makeDateStr();
    objectData.registrer.vegobjekter[0].gyldighetsperiode.startdato = currentDateStr;

    if (token !== null && tokenName !== null) {
      const commands = await wrGateway.registerChangeset(objectData, changesetURL, false, tokenName, token);
      const statusQueryOptions = await wrGateway.giveCommand(commands.start);
      res.send(statusQueryOptions);
    } else {
      res.send("Unable to register, require login")
    }
  } catch(error) {
      console.log("Error occurred in initRegObj: " + error.stack);
      res.send("Failed to start registration");
    }
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
