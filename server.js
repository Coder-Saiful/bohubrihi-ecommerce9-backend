require('dotenv/config');
const app = require('./app');
const mongoose = require('mongoose');

const DB = process.env.MONGODB_URL;

mongoose.set('strictQuery', false);

mongoose.connect(DB).then(() => console.log("Connected to MongoDB Successfully...")).catch(() => console.log("MongoDB Connection Failed!"));

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});