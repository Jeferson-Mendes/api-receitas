const express = require('express');
const cors = require('cors');
require('dotenv').config()
const routes = require('./routes');
const MongooseConnection = require('./database/index');
const app = express();

app.use(cors())
app.use(express.json())
app.use(routes)

// Conection to database
MongooseConnection.init()

app.listen(3333, ()=>{
    console.log('app rodando na porta 3333')
})