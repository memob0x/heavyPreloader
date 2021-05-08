import express from 'express';

const app = express();

app.use('/resources', express.static('./test/resources'));

const port = 8080;

const server = app.listen(port, () => console.log(`Server listening on port ${port}.`));

process.on('SIGTERM', () => server.close(() => console.log('Http server closed.')));
