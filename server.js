require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const POKEDEX = require('./pokedex.json');
const cors = require('cors');
const helmet = require('helmet');
const app = express();

validateBearerToken = ( req, res, next ) => {
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get('Authorization');
    if ( !authToken || apiToken !== authToken.split(' ')[1] ) {
        console.log('your auth token: ', authToken)
        return res.status(401).json({ error: 'Unauthorized request. Check your API Token.' });
    }
    // move to the next middlewear since the auth token passes.
    next();
}

// Preprocessing middlewear and server config
const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common';
app.use( validateBearerToken );
app.use(morgan( morganSetting ));
app.use(cors());
app.use(helmet());
app.use((error, req, res, next) => {
    let response
    if (process.env.NODE_ENV === 'production') {
      response = { error: { message: 'Server error' }}
    } else {
      response = { error }
    }
    res.status( 500 ).json( response )
});
const PORT = process.env.PORT || 8000; // using env var PORT that cloud providers like Heroku will set. 8000 as local fallback.
app.listen( PORT );

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
