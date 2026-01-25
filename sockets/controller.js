const socketController = (socket) =>{
    console.log('Cliente conectado: ', socket.id);

    socket.emit('connected', {
        socketId: socket.id
    });

};

module.exports= {

    socketController
};