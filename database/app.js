const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const Dealer = require("./models/dealership");
const Review = require("./models/review");

const app = express();
const port = process.env.PORT || 3030;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/dealershipsDB";

mongoose
  .connect(mongoUri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Seed data from JSON files if collections are empty
const seedIfEmpty = async () => {
  const dealerCount = await Dealer.countDocuments();
  if (dealerCount === 0) {
    const dealers = require("./data/dealerships.json").dealerships;
    await Dealer.insertMany(dealers);
    console.log(`Seeded ${dealers.length} dealers`);
  }
  const reviewCount = await Review.countDocuments();
  if (reviewCount === 0) {
    const reviews = require("./data/reviews.json").reviews;
    await Review.insertMany(reviews);
    console.log(`Seeded ${reviews.length} reviews`);
  }
};

mongoose.connection.once("open", seedIfEmpty);

app.get("/", (req, res) => {
  res.send("Dealership/Review microservice is running");
});

// Fetch all dealers
app.get("/fetchDealers", async (req, res) => {
  const dealers = await Dealer.find();
  res.json(dealers);
});

// Fetch dealers by state
app.get("/fetchDealers/:state", async (req, res) => {
  const dealers = await Dealer.find({ state: req.params.state });
  res.json(dealers);
});

// Fetch a single dealer by id
app.get("/fetchDealer/:id", async (req, res) => {
  const dealer = await Dealer.findOne({ id: req.params.id });
  res.json(dealer);
});

// Fetch reviews for a dealer
app.get("/fetchReviews/dealer/:id", async (req, res) => {
  const reviews = await Review.find({ dealership: req.params.id });
  res.json(reviews);
});

// Insert a new review
app.post("/insert_review", async (req, res) => {
  const data = req.body;
  const lastReview = await Review.findOne().sort({ id: -1 });
  const newId = lastReview ? lastReview.id + 1 : 1;
  const review = new Review({ id: newId, ...data });
  const saved = await review.save();
  res.json(saved);
});

app.listen(port, () => {
  console.log(`Dealer/review microservice listening on port ${port}`);
});
