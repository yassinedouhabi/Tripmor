import mongoose from "mongoose";

const TripSchema = new mongoose.Schema(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
    },
    providerName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    category: {
      type: String,
      enum: ["private-transfers", "day-trips", "multi-day-tours", "car-rental"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      maxlength: 150,
      default: "",
    },
    images: {
      type: [String],
      default: [],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "MAD",
    },
    duration: {
      type: String,
      required: true,
    },
    departureCity: {
      type: String,
      required: true,
    },
    destinationCity: {
      type: String,
      default: "",
    },
    maxPassengers: {
      type: Number,
      required: true,
      min: 1,
    },
    included: {
      type: [String],
      default: [],
    },
    notIncluded: {
      type: [String],
      default: [],
    },
    highlights: {
      type: [String],
      default: [],
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

TripSchema.index({ category: 1, status: 1, isActive: 1 });
TripSchema.index({ departureCity: 1, status: 1, isActive: 1 });
TripSchema.index({ providerId: 1 });

export default mongoose.models.Trip || mongoose.model("Trip", TripSchema);
