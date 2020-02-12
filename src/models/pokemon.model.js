const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const basicPokemonSchema = Schema({
    id: {
        type: Number,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true,
        minlength: 3,
        unique: true,
    },
    japaneseName: String,
    baseHP: Number,
    category: String,
})
const pokemonModel = mongoose.model("pokemonModel", basicPokemonSchema);

module.exports = pokemonModel;