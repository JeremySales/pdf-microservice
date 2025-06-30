// server.js
const express = require('express');
const convertRoute = require('./routes/convert');
const generateRoute = require('./routes/generate');

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/convert-to-pdf', convertRoute);
app.use('/generate-pdf', generateRoute);

app.listen(PORT, () => {
  console.log(`PDF microservice running on port ${PORT}`);
});
