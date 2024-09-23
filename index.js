const express = require('express');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const companyRoutes = require('./routes/companyRoutes');

const app = express();
const prisma = new PrismaClient();
const upload = multer({ dest: 'public/uploads/' });

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use('/', companyRoutes(prisma, upload));
// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
