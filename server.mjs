import express from 'express';
import fetch from 'node-fetch';
import 'dotenv/config';
import asyncHandler from 'express-async-handler';

const PORT = process.env.PORT
const app = express();

app.use(express.static('public'));

// Note: Don't add or change anything above this line.
/* Add your code here */

app.get('/', async (request, response, next) => {
    response.setHeader("Access-Control-Allow-Origin", "*");
    try {
        const personId = await fetch('https://randomuser.me/api/')
        response.json(await personId.json())
    }
    catch (error) {
        response.status(500).send(error.message)
        window.alert("Error Occurred")
    }
    next();

});

app.get('/check-out', async (request, response, next) => {
    response.setHeader("Access-Control-Allow-Origin", "*");
    try {
        const personId = await fetch('https://randomuser.me/api/')
        response.json(await personId.json())
    }
    catch (error) {
        response.status(500).send(error.message)
        window.alert("Error Occurred")
    }
    next();
});

app.get('/query', async (request, response, next) => {
    response.setHeader("Access-Control-Allow-Origin", "*");
    try {
        const personId = await fetch('https://randomuser.me/api/')
        response.json(await personId.json())
    }
    catch (error) {
        response.status(500).send(error.message)
        window.alert("Error Occurred")
    }
    next();

});

// Note: Don't add or change anything below this line.
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});