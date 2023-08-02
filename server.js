require('dotenv').config();
require('express-async-errors');
const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const ytdl = require('ytdl-core');

const app = express();
const port = process.env.PORT || 3000;

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // 5 requests
    standardHeaders: true,
    legacyHeaders: false
});

const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
    optionsSuccessStatus: 200,
    exposedHeaders: ['Content-Disposition']
}

app.use(express.static('yt-downloader-client/dist'))
app.use('/api', limiter);
app.use(cors(corsOptions));

const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    res.status(500)
    res.render('error', {error: err})
}
app.use(errorHandler);

app.get('/api/download', (req, res) => {
    const url = req.query.url;
    const type = req.query.type;
    let quality = req.query.quality || 'highestvideo';
    //134 - 480p, 136 - 720p, 137 - 1080p, 140 - 128kbps
    const qualities = ['highestvideo', 'highestaudio', '18']
    if (type === 'audio' && quality && quality === 'highestvideo') {
        quality = 'highestaudio';
    }

    if (quality && !qualities.includes(quality)) {
        return res.status(400).send('Invalid quality parameter');
    }

    if (!url) {
        return res.status(400).send('Missing url parameter');
    }

    if (!type) {
        return res.status(400).send('Missing type parameter');
    }

    if (type !== 'video' && type !== 'audio') {
        return res.status(400).send('Invalid type parameter');
    }

    const uuid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    if (type === 'video') {
        res.header('Content-Disposition', `attachment; filename="video-${uuid}.mp4"`);
        return ytdl(url, {
            quality: quality,
            filter: 'videoandaudio'
        })
            .on('error', () => {
                res.status(500).send('Error');
            }).pipe(res);
    } else if (type === 'audio') {
        res.header('Content-Disposition', `attachment; filename="audio-${uuid}.mp3"`);
        return ytdl(url, {
            quality: quality,
            filter: 'audioonly'
        })
            .on('error', () => {
                res.status(500).send('Error');
            })
            .pipe(res);
    }
})

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'yt-downloader-client', 'dist', 'index.html'));
})


app.use((req, res, next) => {
    res.status(404).send('404 Not Found');
});

app.listen(port, () => console.log(`Server running on port ${port}`));
