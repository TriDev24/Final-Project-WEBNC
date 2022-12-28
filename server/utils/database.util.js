import mongoose from 'mongoose';

const { connect } = mongoose;

export default async () => {
    mongoose.set('strictQuery', false);
    mongoose.set('strictPopulate', false);

    await connect(process.env.MONGO_DATABASE_URI).then(() =>
        console.log('Connected!')
    );
};
