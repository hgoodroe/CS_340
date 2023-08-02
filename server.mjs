import express from 'express';
import fetch from 'node-fetch';
import 'dotenv/config';
import asyncHandler from 'express-async-handler';

// "NPM start node" to start server

const PORT = 4000
const app = express();

app.use(express.static('public'));


let count = 0

app.get('/requested_Movies_available', async (request, response, next) => {
    try {

    }
    catch (error) {
        response.status(500).send(error.message)
        window.alert("Error Occurred")
    }
});

app.get('', () => {
    try {

    }
    catch (error) {
        response.status(500).send(error.message)
        window.alert("Error Occurred")
    }
});





// Note: Don't add or change anything below this line.
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});