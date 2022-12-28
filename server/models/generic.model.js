import mongoose from 'mongoose';

const Schema = mongoose.Schema

export default (name, schema) => {
    const parseSchema = new Schema({
        ...schema,
        createdAt: { type: String, default: Date.now },
        updatedAt: { type: String, default: Date.now },
    });

    return mongoose.model(name, parseSchema);
};
