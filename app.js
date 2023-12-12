/*app.js*/
const express = require('express');
const app = express();

const PORT = parseInt(process.env.PORT || '8080');
// const { createLogger, transports } = require('winston')

// const logger = createLogger({
//     transports: [new transports.Console()],
// })
const { customLogger: logger } = require("./customLogger")
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

app.get('/rolldice', (req, res) => {
    logger.info("roolldice hit " + Date.now())
    res.send(getRandomNumber(1, 6).toString());
});

app.listen(PORT, () => {
    logger.info(`Listening for requests on http://localhost:${PORT}`);
});