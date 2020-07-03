const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const apiGateway = require('./ApiGateway');

const app = express();
const port = process.env.PORT || 5000;

axiosInst = axios.create({
  withCredentials: true
})

axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  console.log(config)
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

const nvdbLes = new apiGateway("https://nvdbapiles-v3.atlas.vegvesen.no/")
const nvdbSkriv = new apiGateway('http://localhost:8010/nvdb/apiskriv/rest/v3/endringssett/')
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
  config = {headers: {Cookie : tokenName + '=' + token, 'X-Client': 'NavnPåDinKlient', 'X-NVDB-DryRun': true}})
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

app.get('/getChangeSets', (req, res) => {
  axios.get(
    'http://localhost:8010/nvdb/apiskriv/rest/v3/endringssett',
    {headers: {Cookie : tokenName + '=' + token, 'X-Client': 'NavnPåDinKlient'}})
  .then(response => {res.send(response.data)}).catch(e => {console.log(e)})
})

app.post('/api/getroadobjecttypes', (req, res) => {
    nvdbLes.apiCallSingle(req.body.request).then(data => {res.send(data)}).catch(e => {console.log(e)})

});

app.post('/api/getroadobjects', (req, res) => {
  nvdbLes.apiCall(req.body.request).then(data => {res.send(data)}).catch(e => {console.log(e)})

});

app.listen(port, () => console.log(`Listening on port ${port}`));


async function checkStatus(id){
  let status = 'BEHANDLES'
  while (status === 'BEHANDLES' || status === 'VENTER') {
    let framdrift = await nvdbSkriv(
      response.data[0].src,
      config = {headers: {Cookie : tokenName + '=' + token, 'X-Client': 'NavnPåDinKlient'}})
      
    status = framdrift.data
    console.log(status)
  }
}

