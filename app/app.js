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



/* NOLEGGIA */

app.post('/getRental', function(req, res) {

    console.log('NOLEGGIA');

    console.log('il tag è: ' + req.body.tag);

    /*var user = req.body.state;
    var user = req.body.date;
    var user = req.body.time;*/


    MongoClient.connect('mongodb+srv://admin:admin@database-zsqmz.mongodb.net/test?retryWrites=true', function(err, db) {
        if (err) {
            throw err;
        }
        var dbo = db.db("MonoElettrici");
        dbo.collection("veicoli").updateOne({ tag: req.body.tag }, { $set: { state: true } }).then((result) => {
            if (err) {
                console.log('NO FUNZICA')
                throw err;
            }
            console.log('FUNZICA')
            db.close();
        });

        dbo.collection("noleggio").insertOne({ tag: req.body.tag, user: req.body.user, date: req.body.date, time: req.body.time }, function(err, result) {
            if (err) {
                //console.log(JSON.stringify(result))
                throw err;
            }
            console.log(JSON.stringify(result))
            //res.send(result);
            db.close();
        })
    })
})



/* FINE NOLEGGIO */

app.post('/getNotRental', function(req, res) {

    console.log('FINE NOLEGGIO');

    console.log('il tag è: ' + req.body.tag);

    /*var user = req.body.state;
    var user = req.body.date;
    var user = req.body.time;*/
    var Results = '';

    MongoClient.connect('mongodb+srv://admin:admin@database-zsqmz.mongodb.net/test?retryWrites=true', function(err, db) {
        if (err) {
            throw err;
        }
        var dbo = db.db("MonoElettrici");
        dbo.collection("veicoli").updateOne({ tag: req.body.tag }, { $set: { state: false } }).then((result) => {
            if (err) {
                console.log('NO FUNZICA')
                throw err;
            }
            console.log('FUNZICA')
            db.close();
        });



        dbo.collection("noleggio").find({}, function(err, result) {
            if (err) {
                //console.log(JSON.stringify(result))
                throw err;
            }
            console.log(result)
            Results = result;
            db.close();
        })



        dbo.collection("noleggio").deleteOne({ tag: req.body.tag }, function(err, result) {
            if (err) {
                //console.log(JSON.stringify(result))
                throw err;
            }
            console.log(result)
            db.close();
        })

        res.send(Resultss);

    })
})



app.listen(3000, () => console.log('Example app listening on port 3000!'))

