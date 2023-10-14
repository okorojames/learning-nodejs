const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');
const MONGO_URI = process.env.MONGO_URI;

const connectDB = async (req, res) => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('DB connected');
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
  connectDB();
});
