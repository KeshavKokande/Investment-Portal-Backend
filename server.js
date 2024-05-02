const app = require('./app')
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);
  
mongoose
  .connect(DB)
  .then(() => console.log('DB connection successful!'));

app.listen(8080, () => {
    console.log("Listening to port 8080");
})
