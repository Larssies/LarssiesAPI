const express = require('express');
const app = express();
const port = 3000;

const images = [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg',
];

app.get('/random', (req, res) => {
    const randomIndex = Math.floor(Math.random() * images.length);
    const randomImage = images[randomIndex];

    res.json({ url: randomImage });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});