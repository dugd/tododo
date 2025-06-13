const mongoose = require('mongoose');
const { ServerApiVersion } = require('mongodb');

const url = process.env.DATABASE_URL || 'mongodb://localhost:27017';

const dbConnect = async () => {
    try {
        await mongoose.connect(url, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
        });
        console.log('MongoDB Connected');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

module.exports = dbConnect;
