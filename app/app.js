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
        var dbo = db.db('MonoElettrici');
        dbo.collection('veicoli').find({}).toArray(function(err, result) {
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

    //console.log('il tag è: ' + req.body.tag);

    if (req.body.state == true) {

        console.log('NOLEGGIA');

        MongoClient.connect('mongodb+srv://admin:admin@database-zsqmz.mongodb.net/test?retryWrites=true', function(err, db) {
            if (err) {
                throw err;
            }
            var dbo = db.db('MonoElettrici');
            dbo.collection('veicoli').updateOne({ tag: req.body.tag }, { $set: { state: true, stateVhc: req.body.stateVhc } }).then((result) => {
                if (err) throw err;
                console.log('FUNZICA')
                db.close();
            });

            dbo.collection('noleggio').insertOne({ tag: req.body.tag, user: req.body.user, date: req.body.date, time: req.body.time }, function(err, result) {
                if (err) throw err;
                console.log('il monopattino con il tag: ' + req.body.tag + ' è stato noleggiato')
                db.close();
            })
        })
    } else {


        console.log('FINE NOLEGGIO');

        MongoClient.connect('mongodb+srv://admin:admin@database-zsqmz.mongodb.net/test?retryWrites=true', function(err, db) {
            if (err) {
                throw err;
            }
            var dbo = db.db('MonoElettrici');

            dbo.collection('veicoli').updateOne({ tag: req.body.tag }, { $set: { state: false, stateVhc: req.body.stateVhc } }, function(err, res) {
                if (err) throw err;
                console.log('FUNZICA UPDATE')
                db.close();
            });


            dbo.collection('noleggio').find({ tag: req.body.tag }) .toArray(function(err, result) {
                if (err) throw err;
                //console.log(result)
                res.send(result);
                console.log('FUNZICA FIND');
                db.close();
            })

            dbo.collection('noleggio').deleteOne({ tag: req.body.tag }, function(err, obj) {
                if (err) throw err;
                console.log('FUNZICA DELETE');
                db.close();
            });


        })

    }
})



app.listen(4000, () => console.log('Example app listening on port 4000!'))

