import express from 'express';
import * as http from 'http';
import cors from 'cors';
import debug from 'debug';
import * as expressWinston from 'express-winston';
import path from 'path';
import * as winston from 'winston';
import RouteList from './routes';
import { CommonRoutesConfig } from './utils/common.routes.config';

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = 3000;
const debugLog: debug.IDebugger = debug('app');

app.use(express.static(path.join(__dirname, './public')));
// here we are adding middleware to parse all incoming requests as JSON
app.use(express.json());
// here we are adding middleware to allow cross-origin requests
app.use(cors());

// here we are preparing the expressWinston logging middleware configuration,
// which will automatically log all HTTP requests handled by Express.js
const loggerOptions: expressWinston.LoggerOptions = {
   transports: [new winston.transports.Console()],
   format: winston.format.combine(
      winston.format.json(),
      winston.format.prettyPrint(),
      winston.format.colorize({ all: true })
   ),
};

if (!process.env.DEBUG) {
   loggerOptions.meta = false; // when not debugging, log requests as one-liners
}

// initialize the logger with the above configuration
app.use(expressWinston.logger(loggerOptions));
// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

// after sending the Express.js application object to have the routes added to our app!
const routes: CommonRoutesConfig[] = RouteList.getRoutes(app);


// this is a simple route to make sure everything is working properly
const runningMessage = `Server running at http://localhost:${port}`;
app.get('/', (req: express.Request, res: express.Response) => {
   res.status(200).send(runningMessage)
});
server.listen(port, () => {
   routes.forEach((route: CommonRoutesConfig) => {
      debugLog(`Routes configured for ${route.getName()}`);
   });
   // our only exception to avoiding console.log(), because we
   // always want to know when the server is done starting up
   console.log(runningMessage);
});