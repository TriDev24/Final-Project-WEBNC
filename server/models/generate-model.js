import mongoose from 'mongoose';

export const generateModel = (name, schema) => {
    const parsedSchema = {
        ...schema,
        createdAt: { type: String, default: Date.now() },
        updatedAt: { type: String, default: Date.now() },
    };

    return mongoose.model(name, parsedSchema);
};
