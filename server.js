const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

// const DB = process.env.MANRAN_DB.replace(
//   '<PASSWORD>',
//   process.env.MANRAN_DB_PSWD
// );
  
mongoose
  .connect(DB)
  .then(() => console.log('DB connection successful!'));

app.listen(process.env.PORT || 8000, () => {
    console.log('Server is running...');
});
