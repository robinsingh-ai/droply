// Load environment variables based on NODE_ENV
const dotenv = require('dotenv');
const path = require('path');

// Determine which env file to use
const envFile = process.env.NODE_ENV === 'development' 
  ? '.env.development' 
  : '.env.production';

// Load the appropriate env file
dotenv.config({ path: path.resolve(__dirname, envFile) });

const { PeerServer } = require('peer');
const { URL } = require('url');

// Get environment variables
const PORT = parseInt(process.env.PORT) || 9000;
const PEER_PATH = process.env.PEER_PATH || '/droply';
const DEBUG_LEVEL = parseInt(process.env.DEBUG_LEVEL) || 1;
const CORS_ORIGINS = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
  : ['https://droply.robinsingh.xyz'];

// Create an allow list of valid origins
const allowedOrigins = new Set(CORS_ORIGINS);

// Create custom server with strict origin validation
const peerServer = PeerServer({
  port: PORT,
  path: PEER_PATH,
  debug: DEBUG_LEVEL,
  allow_discovery: false, // Disable discovery for security
  proxied: true, // Enable if behind a proxy like Nginx
  cors: {
    origin: CORS_ORIGINS,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  },
  // Add custom validator for connections
  middleware: {
    auth: (req, res, next) => {
      const origin = req.headers.origin;
      // If no origin or the origin is not in our allow list, reject the connection
      if (!origin || !allowedOrigins.has(origin)) {
        if (process.env.NODE_ENV !== 'development') { // Only log in production for security
          console.warn(`Rejected connection from unauthorized origin: ${origin || 'unknown'}`);
          return res.status(403).send('Forbidden: Origin not allowed');
        }
      }
      next();
    }
  }
});

// Log server startup information
console.log(`PeerJS server running on port ${PORT} with CORS enabled for ${process.env.NODE_ENV} mode`);
console.log(`Allowed origins: ${CORS_ORIGINS.join(', ')}`); 