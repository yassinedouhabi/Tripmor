# Database Models — Tripmor

Complete Mongoose schemas for every collection in the Tripmor database.

## Provider

```javascript
// models/Provider.js
import mongoose from "mongoose";

const ProviderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Company name is required"],
    trim: true,
    maxlength: [100, "Name cannot exceed 100 characters"],
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true,
  },
  description: {
    type: String,
    default: "",
    maxlength: [1000, "Description cannot exceed 1000 characters"],
  },
  logo: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "suspended"],
    default: "pending",
  },
  totalTrips: { type: Number, default: 0 },
  totalBookings: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  stripeAccountId: { type: String, default: "" },
}, {
  timestamps: true,
});

ProviderSchema.index({ status: 1 });
ProviderSchema.index({ slug: 1 }, { unique: true });
ProviderSchema.index({ email: 1 }, { unique: true });

export default mongoose.models.Provider || mongoose.model("Provider", ProviderSchema);
```

## Trip

```javascript
// models/Trip.js
import mongoose from "mongoose";

const CATEGORIES = ["private-transfers", "day-trips", "multi-day-tours", "car-rental"];

const TripSchema = new mongoose.Schema({
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
    required: [true, "Title is required"],
    trim: true,
    maxlength: [150, "Title cannot exceed 150 characters"],
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: {
      values: CATEGORIES,
      message: "{VALUE} is not a valid category",
    },
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    maxlength: [5000, "Description cannot exceed 5000 characters"],
  },
  shortDescription: {
    type: String,
    required: [true, "Short description is required"],
    maxlength: [200, "Short description cannot exceed 200 characters"],
  },
  images: {
    type: [String],
    default: [],
    validate: {
      validator: (v) => v.length <= 10,
      message: "Maximum 10 images allowed",
    },
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
  },
  currency: {
    type: String,
    default: "MAD",
    enum: ["MAD"],
  },
  duration: {
    type: String,
    required: [true, "Duration is required"],
    trim: true,
  },
  departureCity: {
    type: String,
    required: [true, "Departure city is required"],
    trim: true,
  },
  destinationCity: {
    type: String,
    default: "",
    trim: true,
  },
  maxPassengers: {
    type: Number,
    default: 10,
    min: [1, "At least 1 passenger required"],
    max: [50, "Maximum 50 passengers"],
  },
  included: { type: [String], default: [] },
  notIncluded: { type: [String], default: [] },
  highlights: { type: [String], default: [] },
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  totalRatings: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

TripSchema.index({ category: 1, status: 1, isActive: 1 });
TripSchema.index({ departureCity: 1 });
TripSchema.index({ providerId: 1 });
TripSchema.index({ slug: 1 }, { unique: true });
TripSchema.index({ price: 1 });
TripSchema.index({ createdAt: -1 });

export default mongoose.models.Trip || mongoose.model("Trip", TripSchema);
```

## Booking

```javascript
// models/Booking.js
import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trip",
    required: true,
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Provider",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,  // null for guest checkout
  },
  tripTitle: { type: String, required: true },
  providerName: { type: String, required: true },
  customerName: {
    type: String,
    required: [true, "Customer name is required"],
    trim: true,
  },
  customerEmail: {
    type: String,
    required: [true, "Customer email is required"],
    lowercase: true,
    trim: true,
  },
  pickupDate: {
    type: String,
    required: [true, "Pickup date is required"],
  },
  pickupTime: {
    type: String,
    required: [true, "Pickup time is required"],
  },
  pickupLocation: {
    type: String,
    required: [true, "Pickup location is required"],
    trim: true,
  },
  passengers: {
    type: Number,
    required: [true, "Number of passengers is required"],
    min: [1, "At least 1 passenger"],
    max: [50, "Maximum 50 passengers"],
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  commission: {
    type: Number,
    required: true,
    min: 0,
  },
  providerPayout: {
    type: Number,
    required: true,
    min: 0,
  },
  stripeSessionId: {
    type: String,
    required: true,
    unique: true,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "refunded"],
    default: "pending",
  },
  bookingStatus: {
    type: String,
    enum: ["confirmed", "completed", "cancelled"],
    default: "confirmed",
  },
  whatsappSent: { type: Boolean, default: false },
  rated: { type: Boolean, default: false },
  notes: { type: String, default: "" },
}, {
  timestamps: true,
});

BookingSchema.index({ providerId: 1, createdAt: -1 });
BookingSchema.index({ userId: 1, createdAt: -1 });
BookingSchema.index({ tripId: 1 });
BookingSchema.index({ stripeSessionId: 1 }, { unique: true });
BookingSchema.index({ paymentStatus: 1 });
BookingSchema.index({ bookingStatus: 1 });

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
```

## Rating

```javascript
// models/Rating.js
import mongoose from "mongoose";

const RatingSchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trip",
    required: true,
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
    unique: true,  // One rating per booking
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Provider",
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  stars: {
    type: Number,
    required: [true, "Star rating is required"],
    min: [1, "Minimum 1 star"],
    max: [5, "Maximum 5 stars"],
  },
}, {
  timestamps: true,
});

RatingSchema.index({ tripId: 1 });
RatingSchema.index({ providerId: 1 });
RatingSchema.index({ bookingId: 1 }, { unique: true });

export default mongoose.models.Rating || mongoose.model("Rating", RatingSchema);
```

## User

```javascript
// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    default: null,  // null for Google OAuth users
  },
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  role: {
    type: String,
    enum: ["tourist", "provider", "admin"],
    default: "tourist",
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Provider",
    default: null,
  },
  googleId: {
    type: String,
    default: null,
  },
  authMethod: {
    type: String,
    enum: ["credentials", "google"],
    default: "credentials",
  },
}, {
  timestamps: true,
});

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1 });
UserSchema.index({ googleId: 1 });

export default mongoose.models.User || mongoose.model("User", UserSchema);
```

## Relationships

```
User (1) ──── (1) Provider        via User.providerId
Provider (1) ──── (many) Trip     via Trip.providerId
Trip (1) ──── (many) Booking      via Booking.tripId
Booking (1) ──── (0..1) Rating    via Rating.bookingId
Provider (1) ──── (many) Booking  via Booking.providerId
User (1) ──── (many) Booking      via Booking.userId (null for guests)
```

## Utility Queries

```javascript
// Get provider's total earnings
const earnings = await Booking.aggregate([
  { $match: { providerId: new mongoose.Types.ObjectId(providerId), paymentStatus: "paid" } },
  { $group: { _id: null, total: { $sum: "$providerPayout" }, count: { $sum: 1 } } },
]);

// Get platform revenue (admin)
const revenue = await Booking.aggregate([
  { $match: { paymentStatus: "paid" } },
  { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" }, totalCommission: { $sum: "$commission" } } },
]);

// Update trip average rating after new rating
async function updateTripRating(tripId) {
  const result = await Rating.aggregate([
    { $match: { tripId: new mongoose.Types.ObjectId(tripId) } },
    { $group: { _id: null, avg: { $avg: "$stars" }, count: { $sum: 1 } } },
  ]);
  
  if (result.length > 0) {
    await Trip.findByIdAndUpdate(tripId, {
      averageRating: Math.round(result[0].avg * 10) / 10,
      totalRatings: result[0].count,
    });
  }
}

// Update provider average rating
async function updateProviderRating(providerId) {
  const result = await Rating.aggregate([
    { $match: { providerId: new mongoose.Types.ObjectId(providerId) } },
    { $group: { _id: null, avg: { $avg: "$stars" }, count: { $sum: 1 } } },
  ]);
  
  if (result.length > 0) {
    await Provider.findByIdAndUpdate(providerId, {
      averageRating: Math.round(result[0].avg * 10) / 10,
    });
  }
}
```
