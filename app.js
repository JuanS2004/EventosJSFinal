const http = require('http');
const mongoose = require('mongoose');
const url = require('url');
const { StringDecoder } = require('string_decoder');
require('dotenv').config();


mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));


const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method.toLowerCase();
    const decoder = new StringDecoder('utf-8');
    let buffer = '';

    req.on('data', (data) => {
        buffer += decoder.write(data);
    });

    req.on('end', () => {
        buffer += decoder.end();

        res.setHeader('Content-Type', 'application/json');


        if (method === 'get' && path === '/api/events') {

        } else if (method === 'post' && path === '/api/events') {

        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ message: 'Not Found' }));
        }
    });
});

// 
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});