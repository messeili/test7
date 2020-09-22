'use strict'
//dependencies
const dotenv = require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const cors = require('cors');
const methodOverride = require('method-override');

const app = express();
const client = new pg.Client(process.env.DATABASE_URL);
const PORT = process.env.PORT;


app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('./public'));
app.set('view engine', 'ejs');

//routes
app.get('/', mainPageHandler);
app.post('/addJokes', addJokesHandler);
app.get('/favJokes', favJokesHandler);
app.get('/joke/:id', jokeDetailsHandler);
app.delete('/deleteJoke/:id', deleteJokeHandler);
app.put('/updateJoke/:id', updateJokeHandler);








//functions
function mainPageHandler(req, res) {
    let url = `https://official-joke-api.appspot.com/jokes/programming/ten`;
    superagent.get(url).then((results) => {
        res.render('pages/index', { data: results.body })
    })
}

function addJokesHandler(req, res) {
    let { jokeid, type, setup, punchline } = req.body;
    let SQL = `INSERT INTO test7 (jokeid,type,setup,punchline) VALUES ($1,$2,$3,$4);`;
    let VALUES = [jokeid, type, setup, punchline]
    client.query(SQL, VALUES).then(() => {
        res.redirect('/favJokes')
    })
}

function favJokesHandler(req, res) {
    let SQL = `SELECT * FROM test7 ORDER BY id DESC;`;
    client.query(SQL).then((results) => {
        if (results.rows.length != 0) {
            res.render('pages/favJokes', { data: results.rows })
        } else {
            res.render('pages/error', { data: 'Ther is no jokes here' })
        }
    })
}

function jokeDetailsHandler(req, res) {
    let id = req.params.id;
    let SQL = `SELECT * FROM test7 WHERE id=$1;`;
    let VALUES = [id];
    client.query(SQL, VALUES).then((results) => {
        res.render('pages/jokeDetails', { data: results.rows[0] })
    })
}

function deleteJokeHandler(req, res) {
    let id = req.params.id;
    let SQL = `DELETE FROM test7 WHERE id=$1;`;
    let VALUES = [id];
    client.query(SQL, VALUES).then(() => {
        res.redirect('/favJokes')
    })
}

function updateJokeHandler(req, res) {
    let { jokeid, type, setup, punchline } = req.body;
    let id = req.params.id;
    let SQL = `UPDATE test7 SET jokeid=$1,type=$2,setup=$3,punchline=$4 WHERE id=$5;`;
    let VALUES = [jokeid, type, setup, punchline, id];
    client.query(SQL, VALUES).then(() => {
        res.redirect(`/joke/${id}`)
    })
}











//Port listening
client.connect().then(() => {
    app.listen(PORT, () => {
        console.log(`Listening to PORT: ${PORT}`);
    })
})






