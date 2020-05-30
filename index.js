const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const routes = require('./routes');
const { connect } = require('./db/connect');

const loadConfig = require('./lib/config');

config = global.config = loadConfig()

app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(routes())

connect(config.mongo);

app.listen(config.port, () => console.log(`Game server started on port ${config.port}`));