
const express = require('express');
const path = require('path');
const fs = require('fs');


const app = express();


app.use(express.json());


app.use(express.static('public'));


const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
