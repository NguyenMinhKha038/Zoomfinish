const mongoose = require('mongoose');

const URI = 'mongodb+srv://Tieuholy381998:Tieuholy381998@cluster0.s3fyo.mongodb.net/dbname?retryWrites=true&w=majority'
const connectDB = async () => {
    await mongoose.connect(URI, { userUnifiedTopology: true, useNewUrlParser: true })
    console.log('connected...');
}
module.exports = connectDB;