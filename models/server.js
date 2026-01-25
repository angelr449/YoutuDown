const express = require('express');
const cors = require('cors');


const { socketController } = require('../sockets/controller');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT; // Port Server, example: 8080
        this.server = require('http').createServer(this.app); 
        
        // Paths (route)
        this.paths = {
            youtuDown: '/api/youtuDown' // This like: localhost:8080/api/youtuDown
        };

        

        // Middlewares
        this.middlewares();

        // Application routes
        this.routes();

        // Sockets
        this.sockets();
    }



    middlewares() {
        // Enable CORS
        this.app.use(cors());

        // Body parsing (JSON)
        this.app.use(express.json());

        // Sockets

        this.app.use((req, res, next)=>{
            req.io = this.io;
            next();
        })

        // Public directory
        this.app.use(express.static('public'));


    }

    routes() {

        this.app.use(this.paths.youtuDown, require('../routes/youtu-down'));
    }

    sockets() {
        this.io.on('connection', (socket) =>
            socketController(socket, this.io)
        );
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log('Server running on port', this.port);
        });
    }
}

module.exports = Server;
