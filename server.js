const express = require('express');
const app = express();
const path = require('path');
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
const sql=require('mysql');
app.use(express.static(__dirname));


var con = sql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "vin"
  });

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    }
)

function execute_query(query){
    return new Promise((resolve,reject)=>{
        con.query(query, function (err, result) {
            if (err) reject(err);
            resolve(JSON.stringify(result));
          });
    })
      
}

const port = 3000;

// Serve the HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

// Handle the form submission
app.post('/', async function(req, res){

  // Retrieve the form inputs
  const year = req.body.year;
  const make = req.body.make;
  const model = req.body.model;
  const mileage = req.body.mileage;

  // Use the form inputs to filter the database
  if(mileage==''){
  var q=`SELECT * FROM cars WHERE year=${year} AND make='${make}' AND model='${model}' AND listing_price!=0 AND listing_mileage!=0 LIMIT 100`
  }
  else{
    var q=`SELECT * FROM cars WHERE year=${year} AND make='${make}' AND model='${model}' AND (listing_mileage BETWEEN ${mileage}-5000 AND ${mileage}+5000) AND listing_price!=0 LIMIT 100`
  }

  res.setHeader('Content-Type', 'application/json'); 
  let filteredResults=await execute_query(q)
  res.json(filteredResults)
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
