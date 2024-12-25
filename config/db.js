import { MongoClient } from 'mongodb';

export  async function getConnection() {
  //const client = new MongoClient("mongodb://127.0.0.1:27017");
  const client = new MongoClient(process.env.MONGO_URI || "mongodb+srv://<username>:<password>@cluster0.mongodb.net/mydatabase?retryWrites=true&w=majority");
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return client;
  } catch (error) {
    console.error(error);
    throw error;
  } 
}
export default getConnection;