// src/models/Event.js
const mongoose = require('mongoose');

// Definir el esquema del evento
const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    location: String,
    description: String,
});

// Crear el modelo de "Event" basado en el esquema
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;