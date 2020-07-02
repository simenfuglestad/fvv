const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const apiGateway = require('./ApiGateway');

const app = express();
const port = process.env.PORT || 5000;

const nvdb = new apiGateway("https://nvdbapiles-v3.atlas.vegvesen.no/")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/authenticate', (req, res) => {
    axios.post(
        'http://localhost:8010/ws/no/vegvesen/ikt/sikkerhet/aaa/autentiser', 
        {'username': 'bjosor', 'password': 'bjosor'},
        { 'Content-Type': 'application/json'})
    .then(response => {
        console.log('success')
      console.log(response.data);
    })
    .catch(error => {
        console.log('error')
      console.log(error);
    });
});

app.post('/api/getroadobjecttypes', (req, res) => {
    nvdb.apiCallSingle(req.body.request).then(data => {res.send(data)}).catch(e => {console.log(e)})

});

app.post('/api/getroadobjects', (req, res) => {
  nvdb.apiCall(req.body.request).then(data => {res.send(data)}).catch(e => {console.log(e)})

});

app.listen(port, () => console.log(`Listening on port ${port}`));