// app.js
const http = require('http');
const mongoose = require('mongoose');
const { StringDecoder } = require('string_decoder');
const Event = require('./src/models/Event');
require('dotenv').config();


mongoose.connect('mongodb://localhost:27017/eventos-js', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));


const server = http.createServer((req, res) => {
    const decoder = new StringDecoder('utf-8');
    let buffer = '';

    req.on('data', (data) => {
        buffer += decoder.write(data);
    });

    req.on('end', () => {
        buffer += decoder.end();
        res.setHeader('Content-Type', 'application/json');


        if (req.method === 'GET' && req.url === '/api/events') {
            Event.find()
                .then((events) => {
                    res.writeHead(200);
                    res.end(JSON.stringify(events));
                })
                .catch((error) => {
                    res.writeHead(500);
                    res.end(JSON.stringify({ error: 'Error fetching events' }));
                });
        } else if (req.method === 'POST' && req.url === '/api/events') {
            const newEvent = new Event(JSON.parse(buffer));
            newEvent.save()
                .then((event) => {
                    res.writeHead(201);
                    res.end(JSON.stringify(event));
                })
                .catch((error) => {
                    res.writeHead(500);
                    res.end(JSON.stringify({ error: 'Error creating event' }));
                });
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ message: 'Route not found' }));
        }
    });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});