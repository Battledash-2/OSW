/**
 * MIT License
 * Copyright (c) 2022 Battledash-2
 * 
 * An OS simulator on the web.
 */
// == Default settings
const PORT = (typeof process.env.PORT !== 'undefined') ? process.env.PORT : 3000;

// == Node imports
const path = require('node:path');

// == Variables
const express = require('express');
const app = express();

// == Server
app.use(express.Router(), express.static(path.join(__dirname, '/web')));

// == Listen
app.listen(PORT, ()=>console.log('Server running on :'+PORT));