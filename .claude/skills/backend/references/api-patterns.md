# API Route Patterns — Tripmor

Detailed examples for every major API endpoint.

## Trips CRUD

### GET /api/trips — List trips (Public + Provider + Admin)

```javascript
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const city = searchParams.get("city");
    const sort = searchParams.get("sort");
    const status = searchParams.get("status");
    const mine = searchParams.get("mine");

    let filter = {};

    // Public: only approved + active
    if (!mine && !status) {
      filter = { status: "approved", isActive: true };
    }

    // Provider: own trips
    if (mine === "true") {
      const { authorized, session, response } = await requireAuth(["provider"]);
      if (!authorized) return response;
      filter.providerId = session.user.providerId;
    }

    // Admin: by status
    if (status) {
      const { authorized, response } = await requireAuth(["admin"]);
      if (!authorized) return response;
      filter.status = status;
    }

    if (category) filter.category = category;
    if (city) filter.departureCity = city;

    let sortOption = { createdAt: -1 };
    if (sort === "price-low") sortOption = { price: 1 };
    if (sort === "price-high") sortOption = { price: -1 };
    if (sort === "rating") sortOption = { averageRating: -1 };

    const trips = await Trip.find(filter).sort(sortOption).lean();
    return NextResponse.json(trips);
  } catch (error) {
    console.error("GET /api/trips:", error);
    return NextResponse.json({ error: "Failed to fetch trips" }, { status: 500 });
  }
}
```

### POST /api/trips — Create trip (Provider)

```javascript
export async function POST(request) {
  try {
    const { authorized, session, response } = await requireAuth(["provider"]);
    if (!authorized) return response;

    await connectDB();

    // Check provider is approved
    const provider = await Provider.findById(session.user.providerId);
    if (!provider || provider.status !== "approved") {
      return NextResponse.json({ error: "Provider not approved" }, { status: 403 });
    }

    const body = await request.json();

    // Validate
    const errors = validateTrip(body);
    if (errors.length > 0) {
      return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
    }

    // Generate unique slug
    let slug = slugify(body.title);
    const existing = await Trip.findOne({ slug });
    if (existing) slug = `${slug}-${Date.now()}`;

    const trip = await Trip.create({
      ...body,
      slug,
      providerId: provider._id,
      providerName: provider.name,
      status: "pending",
      isActive: true,
    });

    // Update provider trip count
    await Provider.findByIdAndUpdate(provider._id, { $inc: { totalTrips: 1 } });

    return NextResponse.json(trip, { status: 201 });
  } catch (error) {
    console.error("POST /api/trips:", error);
    return NextResponse.json({ error: "Failed to create trip" }, { status: 500 });
  }
}
```

### PUT /api/trips/[id] — Update trip (Provider owns it, or Admin)

```javascript
// app/api/trips/[id]/route.js
export async function PUT(request, { params }) {
  try {
    const { authorized, session, response } = await requireAuth(["provider", "admin"]);
    if (!authorized) return response;

    await connectDB();
    const trip = await Trip.findById(params.id);
    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    // Provider can only update their own trips
    if (session.user.role === "provider" &&
        trip.providerId.toString() !== session.user.providerId) {
      return NextResponse.json({ error: "Not your trip" }, { status: 403 });
    }

    const body = await request.json();

    // Admin can change status (approve/reject)
    if (session.user.role === "admin" && body.status) {
      trip.status = body.status;
      await trip.save();
      return NextResponse.json(trip);
    }

    // Provider updates content — reset to pending for re-approval
    Object.assign(trip, body);
    if (session.user.role === "provider") {
      trip.status = "pending";
    }
    await trip.save();

    return NextResponse.json(trip);
  } catch (error) {
    console.error("PUT /api/trips/[id]:", error);
    return NextResponse.json({ error: "Failed to update trip" }, { status: 500 });
  }
}
```

## Providers Management (Admin)

### PUT /api/providers/[id] — Approve/Reject/Suspend

```javascript
export async function PUT(request, { params }) {
  try {
    const { authorized, response } = await requireAuth(["admin"]);
    if (!authorized) return response;

    await connectDB();
    const body = await request.json();
    const { status } = body;

    if (!["approved", "rejected", "suspended"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const provider = await Provider.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    );

    if (!provider) {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 });
    }

    // If suspended, deactivate all their trips
    if (status === "suspended") {
      await Trip.updateMany({ providerId: provider._id }, { isActive: false });
    }

    return NextResponse.json(provider);
  } catch (error) {
    console.error("PUT /api/providers/[id]:", error);
    return NextResponse.json({ error: "Failed to update provider" }, { status: 500 });
  }
}
```

## Ratings

### POST /api/trips/[id]/rate

```javascript
export async function POST(request, { params }) {
  try {
    await connectDB();
    const body = await request.json();
    const { bookingId, stars, customerName } = body;

    // Validate
    if (!bookingId || !stars || !customerName) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }
    if (stars < 1 || stars > 5) {
      return NextResponse.json({ error: "Stars must be 1-5" }, { status: 400 });
    }

    // Check booking exists and belongs to this trip
    const booking = await Booking.findById(bookingId);
    if (!booking || booking.tripId.toString() !== params.id) {
      return NextResponse.json({ error: "Invalid booking" }, { status: 400 });
    }
    if (booking.rated) {
      return NextResponse.json({ error: "Already rated" }, { status: 400 });
    }

    // Create rating
    await Rating.create({
      tripId: params.id,
      bookingId,
      providerId: booking.providerId,
      customerName,
      stars,
    });

    // Mark booking as rated
    booking.rated = true;
    await booking.save();

    // Update averages
    await updateTripRating(params.id);
    await updateProviderRating(booking.providerId);

    return NextResponse.json({ message: "Rating submitted" }, { status: 201 });
  } catch (error) {
    console.error("POST /api/trips/[id]/rate:", error);
    return NextResponse.json({ error: "Failed to submit rating" }, { status: 500 });
  }
}
```

## Admin Stats

### GET /api/admin/stats

```javascript
export async function GET(request) {
  const { authorized, response } = await requireAuth(["admin"]);
  if (!authorized) return response;

  await connectDB();

  const [
    totalProviders,
    pendingProviders,
    totalTrips,
    pendingTrips,
    totalBookings,
    revenueResult,
  ] = await Promise.all([
    Provider.countDocuments(),
    Provider.countDocuments({ status: "pending" }),
    Trip.countDocuments({ status: "approved" }),
    Trip.countDocuments({ status: "pending" }),
    Booking.countDocuments({ paymentStatus: "paid" }),
    Booking.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: {
        _id: null,
        totalRevenue: { $sum: "$totalPrice" },
        totalCommission: { $sum: "$commission" },
      }},
    ]),
  ]);

  const revenue = revenueResult[0] || { totalRevenue: 0, totalCommission: 0 };

  return NextResponse.json({
    totalProviders,
    pendingProviders,
    totalTrips,
    pendingTrips,
    totalBookings,
    totalRevenue: revenue.totalRevenue,
    totalCommission: revenue.totalCommission,
  });
}
```

## Pagination Pattern

```javascript
// Add to any list endpoint
const page = parseInt(searchParams.get("page") || "1");
const limit = parseInt(searchParams.get("limit") || "12");
const skip = (page - 1) * limit;

const [items, total] = await Promise.all([
  Trip.find(filter).sort(sortOption).skip(skip).limit(limit).lean(),
  Trip.countDocuments(filter),
]);

return NextResponse.json({
  items,
  pagination: {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
  },
});
```
