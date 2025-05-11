// app.js
const http = require('http');
const mongoose = require('mongoose');
const { StringDecoder } = require('string_decoder');
const Event = require('./src/models/Event');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Conectar a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Conectado a MongoDB Atlas'))
    .catch((err) => console.error('Error de conexión:', err));

// Crear servidor HTTP
const server = http.createServer((req, res) => {
    const decoder = new StringDecoder('utf-8');
    let buffer = '';

    req.on('data', (data) => {
        buffer += decoder.write(data);
    });

    req.on('end', () => {
        buffer += decoder.end();
        res.setHeader('Content-Type', 'application/json');

        // GET todos los eventos
        if (req.method === 'GET' && req.url === '/api/events') {
            Event.find()
                .then((events) => {
                    res.writeHead(200);
                    res.end(JSON.stringify(events));
                })
                .catch((err) => {
                    res.writeHead(500);
                    res.end(JSON.stringify({ error: 'Error al obtener eventos' }));
                });
        }

        // POST nuevo evento
        else if (req.method === 'POST' && req.url === '/api/events') {
            const data = JSON.parse(buffer);
            const newEvent = new Event(data);
            newEvent.save()
                .then((event) => {
                    res.writeHead(201);
                    res.end(JSON.stringify(event));
                })
                .catch((err) => {
                    res.writeHead(400);
                    res.end(JSON.stringify({ error: 'Error al crear evento' }));
                });
        }

        // Ruta no encontrada
        else {
            res.writeHead(404);
            res.end(JSON.stringify({ message: 'Ruta no encontrada' }));
        }
    });
});

server.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});