const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

const picturesFolder = path.join(__dirname, 'pictures');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
})

app.get('/random', (req, res) => {
    fs.readdir(picturesFolder, (err, files) => {
        if (err) {
            console.error('Error reading pictures folder:', err);
            return res.status(500).json({
                error: 'Internal Server Error',
                success: false 
            });
        }

        const randomIndex = Math.floor(Math.random() * files.length);
        const randomImage = path.join('/pictures', files[randomIndex]).replace(/\\/g, '/');
        const fullUrl = `${req.protocol}://${req.get('host')}${randomImage}`;

        res.json({
            url: fullUrl, 
            success: true
        });
    });
});

app.use('/pictures', express.static('pictures'));

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});