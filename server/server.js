const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const apiGateway = require('./ApiGateway');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  console.log(config)
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

const nvdb = new apiGateway("https://nvdbapiles-v3.atlas.vegvesen.no/")
let token;
let tokenName;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//authenticate docker
axios.post(
  'http://localhost:8010/ws/no/vegvesen/ikt/sikkerhet/aaa/autentiser', 
  {'username': 'ap', 'password': 'ap'},
  { 'Content-Type': 'application/json'})
.then(response => {
  console.log('success')
console.log(response.data);
  token = response.data.token;
  tokenName = response.data.tokenname;
})
.catch(error => {
  console.log('error')
console.log(error);
});

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
    
  // STEP 2: Adding new data to users object 
  cases.push(req.body); 
    
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

