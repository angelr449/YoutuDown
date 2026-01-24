const express = require('express');
const cors = require('cors');
// const fileUpload = require('express-fileupload')

// const { socketController } = require('../sockets/controller');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = require('http').createServer(this.app);
        // this.io = require('socket.io')(this.server)

        this.paths = {
            youtuDown: '/api/youtuDown'
        };

        // Database connection

        // Middlewares
        this.middlewares();

        // Application routes
        this.routes();

        // Sockets
        // this.sockets();
    }

    // async connectDB() {
    //     await dbConnection();
    // }

    middlewares() {
        // Enable CORS
        this.app.use(cors());

        // Body parsing (JSON)
        this.app.use(express.json());

        // Public directory
        this.app.use(express.static('public'));

        // File upload middleware
        // this.app.use(fileUpload({
        //     useTempFiles: true,
        //     tempFileDir: '/tmp/',
        //     createParentPath: true
        // }));
    }

    routes() {
        // this.app.use(this.paths.videoInfo, require('../routes/video-info'));
        // this.app.use(this.paths.videoDownload, require('../routes/video-download'));
        this.app.use(this.paths.youtuDown, require('../routes/youtu-down'));
    }

    // sockets() {
    //     this.io.on('connection', (socket) =>
    //         socketController(socket, this.io)
    //     );
    // }

    listen() {
        this.server.listen(this.port, () => {
            console.log('Server running on port', this.port);
        });
    }
}

module.exports = Server;
