import mongoose from "mongoose";

const RatingSchema = new mongoose.Schema({
  politic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Politic",
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  comment: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Rating = mongoose.model("Rating", RatingSchema);

export default Rating;
