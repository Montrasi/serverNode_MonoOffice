/*eslint-env node*/

var express = require('express');
var app = express();
const bodyParser = require('body-parser')
var MongoClient = require('mongodb');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const cors = require('cors');
app.use(cors());


app.get('/', (req, res) => {
    res.send('Welcome to Node API');
    console.log('Contattoooo');
})


/* GET VEICOLI */

app.get('/getVeicoli', function(req, res) {

    console.log('GET | VEICOLI');

    MongoClient.connect('mongodb+srv://admin:admin@database-zsqmz.mongodb.net/test?retryWrites=true', function(err, db) {
        if (err) {
            throw err;
        }
        var dbo = db.db("MonoElettrici");
        dbo.collection("veicoli").find({}).toArray(function(err, result) {
            if (err) {
                //console.log(JSON.stringify(result))
                throw err;
            }
            //console.log(result)
            res.send(result);
            db.close();
        });

    });

})


app.listen(4000, () => console.log('Example app listening on port 4000!'))

