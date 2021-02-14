'use strict';

// eslint-disable-next-line import/no-unresolved
const express = require('express');
const AWS = require("aws-sdk");

const app = express();
const dynamoDB = new AWS.DynamoDB({
  region: "us-east-1"
})

// Routes
app.get('/', (req, res) => {
  res.send(`Request received: ${req.method} - ${req.path}`);
});

app.get('/fish', (req, res) => {
  
  let start_date = req.query.start;
  let end_date = req.query.end;

 if(start_date != undefined && end_date != undefined){
  dynamoDB
  .scan({
    TableName: "Fish-Price",
    FilterExpression: "#date BETWEEN :start and :end",
    ExpressionAttributeValues: {
      ":start": {
        "S": start_date,
      },
      ":end": {
        "S": end_date,
      }
    },
    ExpressionAttributeNames: {
      "#date": "date"
    }
  })
  .promise()
  .then(data => res.send(data));
 } else {
    dynamoDB
    .scan({
      TableName: "Fish-Price",
    })
    .promise()
    .then(data => res.send(data));
 }
})

// Error handler
app.use((err, req, res) => {
  console.error(err);
  res.status(500).send('Internal Serverless Error');
});

module.exports = app;
