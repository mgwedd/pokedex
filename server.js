const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));
app.use((req, res) => {
    res.send('Hey, I\'m a server! Happy to be here.');
});

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server initialized and listening on htttp://localhost:${ PORT }`);
});