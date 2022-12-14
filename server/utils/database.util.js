import mongoose from "mongoose";

const { connect, connection } = mongoose;

export default async () => {
  mongoose.set("strictQuery", false);
  await connect(process.env.MONGO_DATABASE_URI)
    .then(() => console.log("Connected!"));
};
