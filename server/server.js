const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 5000;



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/getIssues', (req, res) => {
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

app.post('/api/registerIssue', (req, res) => {
    console.log(req.body);
    const fs = require("fs"); 
  
    // STEP 1: Reading JSON file 
    const data = require("./data.json"); 
    
    // STEP 2: Adding new data to users object 
    data.push(req.body); 
    
    // STEP 3: Writing to a file 
    fs.writeFile("data.json", JSON.stringify(data), err => { 
        
        // Checking for errors 
        if (err) throw err;  
    
        console.log("Done writing"); // Success 
    }); 
    res.send(
        `I received your POST request. This is what you sent me: ${req.body.post}`,
    );
});

app.listen(port, () => console.log(`Listening on port ${port}`));