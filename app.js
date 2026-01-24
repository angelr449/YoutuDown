'use strict'
// const youtubedl = require('youtube-dl-exec')
const fs = require('fs')
require('dotenv').config();


const Server = require('./models/server');





const server  = new Server();

server.listen();




