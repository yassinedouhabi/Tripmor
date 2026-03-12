# Stripe Integration — Tripmor

Complete Stripe Checkout + Webhook implementation with commission split.

## Checkout Session Creation

```javascript
// app/api/stripe/checkout/route.js
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { connectDB } from "@/lib/mongodb";
import Trip from "@/models/Trip";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { tripId, customerName, customerEmail, pickupDate, pickupTime, pickupLocation, passengers } = body;

    // Validate input
    if (!tripId || !customerName || !customerEmail || !pickupDate || !pickupTime || !pickupLocation || !passengers) {
      return NextResponse.json({ error: "All booking fields are required" }, { status: 400 });
    }

    // Fetch trip from DB — NEVER trust client-sent prices
    const trip = await Trip.findById(tripId).lean();
    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }
    if (trip.status !== "approved" || !trip.isActive) {
      return NextResponse.json({ error: "Trip is not available" }, { status: 400 });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [{
        price_data: {
          currency: "mad",
          product_data: {
            name: trip.title,
            description: `${trip.departureCity} → ${trip.destinationCity || trip.departureCity} · ${trip.duration}`,
            images: trip.images.length > 0 ? [trip.images[0]] : [],
          },
          unit_amount: Math.round(trip.price * 100), // Stripe uses cents
        },
        quantity: 1,
      }],
      metadata: {
        tripId: trip._id.toString(),
        providerId: trip.providerId.toString(),
        tripTitle: trip.title,
        providerName: trip.providerName,
        customerName,
        customerEmail,
        pickupDate,
        pickupTime,
        pickupLocation,
        passengers: passengers.toString(),
      },
      customer_email: customerEmail,
      success_url: `${process.env.NEXTAUTH_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/trips/${trip.slug}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 });
  }
}
```

## Webhook Handler

```javascript
// app/api/stripe/webhook/route.js
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Provider from "@/models/Provider";
import { calculateCommission } from "@/lib/utils";

// CRITICAL: Disable body parsing for webhooks
export const config = {
  api: { bodyParser: false },
};

export async function POST(request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      await connectDB();

      // Idempotency check — don't create duplicate bookings
      const existingBooking = await Booking.findOne({ stripeSessionId: session.id });
      if (existingBooking) {
        return NextResponse.json({ received: true });
      }

      // Calculate commission split
      const totalPrice = session.amount_total / 100; // Convert from cents
      const { commission, providerPayout } = calculateCommission(totalPrice);

      // Extract metadata
      const meta = session.metadata;

      // Create booking
      await Booking.create({
        tripId: meta.tripId,
        providerId: meta.providerId,
        tripTitle: meta.tripTitle,
        providerName: meta.providerName,
        customerName: meta.customerName,
        customerEmail: meta.customerEmail,
        pickupDate: meta.pickupDate,
        pickupTime: meta.pickupTime,
        pickupLocation: meta.pickupLocation,
        passengers: parseInt(meta.passengers),
        totalPrice,
        commission,
        providerPayout,
        stripeSessionId: session.id,
        paymentStatus: "paid",
        bookingStatus: "confirmed",
      });

      // Update provider stats
      await Provider.findByIdAndUpdate(meta.providerId, {
        $inc: { totalBookings: 1 },
      });

    } catch (error) {
      console.error("Webhook processing error:", error);
      return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
```

## Success Page Data Fetching

```javascript
// app/(public)/booking/success/page.js
import { stripe } from "@/lib/stripe";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";

export default async function BookingSuccess({ searchParams }) {
  const sessionId = searchParams.session_id;
  if (!sessionId) redirect("/");

  await connectDB();
  const booking = await Booking.findOne({ stripeSessionId: sessionId }).lean();

  if (!booking) {
    return <p>Booking not found. Please contact support.</p>;
  }

  const whatsappMessage = encodeURIComponent(
    `Hi! I just booked "${booking.tripTitle}" for ${booking.pickupDate} at ${booking.pickupTime}. Booking ref: ${booking._id}. Looking forward to it!`
  );
  const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${whatsappMessage}`;

  return (
    // Render confirmation with booking details + WhatsApp link
  );
}
```

## Client-Side Checkout Trigger

```javascript
// components/booking/BookingForm.jsx
"use client";
import { useState } from "react";

export default function BookingForm({ tripId }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData) {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripId,
          customerName: formData.get("name"),
          customerEmail: formData.get("email"),
          pickupDate: formData.get("pickupDate"),
          pickupTime: formData.get("pickupTime"),
          pickupLocation: formData.get("pickupLocation"),
          passengers: parseInt(formData.get("passengers")),
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (error) {
      alert("Failed to start checkout");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={loading}>
        {loading ? "Processing..." : "Book Now"}
      </button>
    </form>
  );
}
```

## Testing Webhooks Locally

```bash
# Install Stripe CLI
# Then run:
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Copy the webhook signing secret (whsec_...) to .env.local
```

## Test Cards

```
Success:    4242 4242 4242 4242
Decline:    4000 0000 0000 0002
3D Secure:  4000 0025 0000 3155
Exp date:   Any future date
CVC:        Any 3 digits
```

## Key Rules

1. **Never trust client-sent prices** — always fetch from database
2. **Webhook creates bookings** — not the checkout endpoint
3. **Always verify webhook signatures** — prevents fake events
4. **Idempotency** — check for existing booking before creating
5. **Use metadata** — pass all booking details through Stripe session
6. **Currency in cents** — Stripe uses smallest currency unit (1 MAD = 100 centimes)
7. **Error handling** — webhook must return 200 even on processing errors (Stripe retries otherwise)
