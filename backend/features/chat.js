var chatDb = new(require("./database/chat"));

var chat = {
    init: function init(server) {
        var WebSocketServer = require("ws").Server;
        var webSocketServer = new WebSocketServer({ server: server });

        // connected users
        var clients = {};
        // all messages
        // var history = chatDb.getHistory();

        webSocketServer.on('connection', function(socket) {

            var id = Math.random();
            clients[id] = socket;
            console.log('client connected', id);

            chatDb.getHistory().then(function(data) {
                // console.log(data);
                try {
                    console.log('try');
                    clients[id].send(data);

                } catch (err) {
                    console.log(err);

                }

                res.status(200).send(data);
            }).catch(function(error) {
                res.status(500).send(error);
            });

            // console.log(JSON.stringify(history));

            // clients[id].send(history);


            socket.on('message', function(obj) {

                chatDb.addMessage(obj).then(function() {
                    for (var key in clients) {
                        clients[key].send(obj);
                        console.log('sent' + key);
                    }
                }).catch(function(error) {
                    res.status(500).send(error);
                });


            });

            socket.on('close', function() {
                delete clients[id];
            });
        });
    }
};

module.exports = chat;
