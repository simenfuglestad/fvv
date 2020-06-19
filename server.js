const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/getIssues', (req, res) => {
    const data = require('./data.json');
    res.send(data);
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