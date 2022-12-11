import mongoose from 'mongoose';

const { connect, connection } = mongoose;

export const bootstrapDatabase = async () => {
    console.log('dcm: ', process.env.MONGO_DATABASE_URI);

    connect(process.env.MONGO_DATABASE_URI, {
        dbName: 'internet-banking',
        user: 'trongtri',
        pass: '1234',
    });

    connection.once('open', () => {
        console.log('MongoDB database connection established successfully');
    });
};
