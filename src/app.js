require('dotenv').config();
const https = require('https');
const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const app = express();
const port = 8443;

const currentTime = new Date();
const hours = currentTime.getHours();
const minutes = currentTime.getMinutes();
const formattedHours = hours < 10 ? `0${hours}` : hours;
const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
const currentTimeString = `${formattedHours}:${formattedMinutes}`;

const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/api.larssies.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/api.larssies.com/fullchain.pem'),
};

const server = https.createServer(options, app);

const picturesFolder = path.join(__dirname, 'cdn');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/random', (req, res) => {
    const count = parseInt(req.query.count);

    if (count && count > 1) {
        handleMultipleRandomPictures(req, res, count);
    } else {
        fs.readdir(picturesFolder, (err, files) => {
            if (err) {
                console.error('Error reading pictures folder:', err);
                return res.status(500).json({
                    error: 'Internal Server Error',
                    success: false 
                });
            }

            const randomIndex = Math.floor(Math.random() * files.length);
            const randomImage = path.join('/cdn', files[randomIndex]).replace(/\\/g, '/');
            const fullUrl = `https://${req.get('host')}${randomImage}`;

            console.log(`[${currentTimeString}] Request received for ${req.url}`);

            res.json({
                url: fullUrl, 
                success: true
            });
        });
    }
});

app.get('/weather', (req, res) => {
    const city = req.query.city;

    if(city && city != null) {
        getWeather(city)
        .then((weatherInfo) => {
            const temperatureCelsius = weatherInfo.temperature - 273.15;

            console.log(`[${currentTimeString}] Request received for ${req.url}`);
            res.json({
                temperature: Math.ceil((temperatureCelsius) * 10 ) / 10 + " °C", 
                description: weatherInfo.description,
                success: true
            });

        })
        .catch((error) => {
            console.error('Failed to get weather information:', error.message);
            return res.status(500).json({
                error: 'Internal Server Error',
                success: false 
            });
        });
    } else {
        return res.status(500).json({
            error: 'No city provided',
            success: false 
        });
    }
});

function handleMultipleRandomPictures(req, res, count) {
    fs.readdir(picturesFolder, (err, files) => {
        if (err) {
            console.error('Error reading pictures folder:', err);
            return res.status(500).json({
                error: 'Internal Server Error',
                success: false 
            });
        }

        const selectedImages = [];

        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * files.length);
            const randomImage = path.join('/cdn', files[randomIndex]).replace(/\\/g, '/');
            const fullUrl = `https://${req.get('host')}${randomImage}`;
            selectedImages.push({
                url: fullUrl,
                success: true
            });
        }

        console.log(`[${currentTimeString}] Request received for ${req.url}`);

        res.json(selectedImages);
    });
}

const getWeather = async (city) => {
    const apiKey = process.env.API_KEY
    try {
      const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
      const weatherData = response.data;
      return {
        temperature: weatherData.main.temp,
        description: weatherData.weather[0].description,
      };
    } catch (error) {
      console.error('Error fetching weather data:', error.message);
      throw error;
    }
};

app.use('/cdn', express.static('cdn'));

server.listen(port, () => {
    console.log(`Server is running at https://api.larssies.com/random`);
});

process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Server is gracefully shutting down');
        process.exit(0);
    });
});