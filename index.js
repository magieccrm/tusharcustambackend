// // index.js

// const app = require('./app');
const connectDatabase = require('./config/database');

// // Handling uncaught error
// process.on('uncaughtException', (err) => {
//   console.error(`Uncaught Exception: ${err.message}`);
//   console.log('Shutting down the server due to uncaught exception');
//   process.exit(1);
// });
// const PORT = process.env.PORT || 3001; 
// (async (req) => {
//   try {
//       app.listen(PORT, () => {
//       console.log(`Server is working on http://localhost:${PORT}`);
//     });
    
//   } catch (error) {
//     console.error('Error connecting to the database:', error);
//     process.exit(1);
//   }
// })();
// process.on('unhandledRejection', (err) => {
//   console.error(`Unhandled Rejection: ${err.message}`);
//   console.log('Shutting down the server due to unhandled promise rejection');
//   process.exit(1);
// });



// this is new indexe.js 

const app = require('./app');

const PORT = process.env.PORT || 5001; 
connectDatabase();
app.listen(PORT, () => {
  console.log(`Server is working on http://localhost:${PORT}`);
});

// Handling uncaught error
process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  console.log('Shutting down the server due to uncaught exception');
  process.exit(1);
});
 
// Unhandled promise rejection
process.on('unhandledRejection', (err) => {   
  console.error(`Unhandled Rejection: ${err.message}`);
  console.log('Shutting down the server due to unhandled promise rejection');
  process.exit(1);
});
