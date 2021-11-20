/* Ejercicio de prueba*/
require('dotenv').config();
const cors = require('cors');

const morgan = require('morgan');

const redis = require('redis');

const redisClient = redis.createClient({
    host: process.env.REDIS_URI,
    port: 6379
})

const mongo = require('./connectToMongoDB');

const port = process.env.APP_PORT;
const morganFormat = process.env.APP_MORGAN_FORMAT;

const express = require('express')
const app = express()

app.use(cors());

app.use(morgan('dev'));

app.get('/', function (req, res) {
    const texto = 'Esta es información obtenidad desde tu API Meeting 43 redis!!';
    console.log(texto)
    res.send(texto)
})

app.get('/version', function (req, res) {
    res.send('API v1.0 (con soporte de MongoDB)')
})


app.post('/users-redis', async (req, res) => {
    try {
        await mongo.addNewUser();
        res.sendStatus(200);
    } catch (err) {
        console.error(`Error: `, err.message);
    }
})

// app.get('/users', async (req, res) => {
//     try {
//         let users = await mongo.getAllUsers();
//         res.send(users);
//     } catch (err) {
//         console.error(`Error: `, err.message);
//         res.status(500)
//     }
// })


app.get('/users-redis', async (req, res) => {
    const userRedisKey = "User";

    redisClient.get(userRedisKey, async (error, result) => {
        // Si hay error, lo devolvemos
        if (error) {
            res.json(error);
        }
        // Si hay algún resultado, quiere decir que fue obtenido desde Redis
        // En este caso, lo devolvemos sin más
        if (result) {
            res.send(result);
        } else {
            // Si no se encontró nada en Redis, se busca en la DB
            let user = await mongo.getAllUsers();

            // Y se guarda en Redis para que esté disponible en la próxima llamada
            redisClient.set(userRedisKey, JSON.stringify(user));

            res.send(user);
        }
    });
})

app.listen(port, () => {
    console.log(`Aplicación escuchando en el puerto ${port}`);
})
