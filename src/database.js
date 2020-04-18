const mongoose = require("mongoose");

class Database {
  constructor() {
    this.mongo();
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      // "mongodb+srv://deploy:xTc6NczeSwCpJzN@cluster0-pgsmm.mongodb.net/chat_tools?retryWrites=true&w=majority",
      process.env.MONGO_URL,
      {
        useNewUrlParser: true,
      }
    );
  }
}

module.exports = new Database();
