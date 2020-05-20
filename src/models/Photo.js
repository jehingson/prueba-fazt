const {Schema, model } = require('mongoose');

const Photo = new Schema({
    title: String,
    description: String,
    imagenURL: String,
    public_id: String  
});

module.exports = model('Photo', Photo);