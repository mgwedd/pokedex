require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const POKEDEX = require('./pokedex.json');
const cors = require('cors');
const app = express();
const PORT = 8000;

validateBearerToken = ( req, res, next ) => {
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get('Authorization');
    if ( !authToken || apiToken !== authToken.split(' ')[1] ) {
        return res.status(401).json({ error: 'Unauthorized request. Check your API Token.' })
    }
    // move to the next middlewear since the auth token passes.
    next();
}

// PREPROCESSING MIDDLEWEAR
app.use( validateBearerToken );
app.use(morgan('dev'));
app.options('*', cors())
app.use(cors());

// GET /TYPES ENDPOINT
handleGetTypes = ( req, res ) => {
    const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychic`, `Rock`, `Steel`, `Water`]
    res.json( validTypes );
} 
app.get( '/types', handleGetTypes );
// ===================

// GET /POKEMON ENDPOINT
handleGetPokemon = ( req, res ) => {
    const { name, type } = req.query;
    let results = POKEDEX.pokemon; // return all if no search filters applied.
    if ( name ) {
        const lowerCaseName = name.toLowerCase();
        results = results.filter( pokemon => pokemon.name.toLowerCase().includes( lowerCaseName ));
    }
    if ( type ) {
        const inputTypeUpper = type[0].toUpperCase() + type.slice(1);
        const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychic`, `Rock`, `Steel`, `Water`];
        if ( validTypes.includes( inputTypeUpper ) ) {
            results = results.filter( pokemon => pokemon.type.includes( inputTypeUpper ));
        }
    }
    res.json( results );
}
app.get( '/pokemon', handleGetPokemon );
// ===================

app.listen(PORT, () => {
    console.log(`Server initialized and listening on htttp://localhost:${ PORT }`);
});