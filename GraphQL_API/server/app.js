const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/schema");
const mongoose = require("mongoose");
require("dotenv").config(); // Store MongoDB URI safely in .env file

const app = express();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

mongoose.connection.once("open", () => {
  console.log("Connected to database");
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true // Enables GraphiQL for testing queries
  })
);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/graphql`);
});