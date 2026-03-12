# Authentication — Tripmor

Complete NextAuth.js setup with registration flows, middleware, and role-based access.

## NextAuth API Route

```javascript
// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

## Full Auth Configuration

```javascript
// lib/auth.js
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { connectDB } from "./mongodb";
import User from "@/models/User";
import Provider from "@/models/Provider";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        await connectDB();
        const user = await User.findOne({ email: credentials.email.toLowerCase() });

        if (!user) {
          throw new Error("No account found with this email");
        }

        if (!user.password) {
          throw new Error("This account uses Google login");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          providerId: user.providerId?.toString() || null,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      // Handle Google OAuth — create user if doesn't exist
      if (account?.provider === "google") {
        await connectDB();
        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          await User.create({
            email: user.email,
            name: user.name,
            role: "tourist",
            googleId: account.providerAccountId,
            authMethod: "google",
          });
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role;
        token.providerId = user.providerId;
      }

      // For Google users, fetch role from DB
      if (account?.provider === "google") {
        await connectDB();
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) {
          token.role = dbUser.role;
          token.providerId = dbUser.providerId?.toString() || null;
          token.sub = dbUser._id.toString();
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.providerId = token.providerId;
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};
```

## Registration Endpoints

### Tourist Registration

```javascript
// app/api/auth/register/tourist/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request) {
  try {
    await connectDB();
    const { name, email, password } = await request.json();

    // Validate
    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    // Check existing
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    // Create user
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: "tourist",
      authMethod: "credentials",
    });

    return NextResponse.json(
      { message: "Account created", userId: user._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Tourist registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
```

### Provider Registration

```javascript
// app/api/auth/register/provider/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Provider from "@/models/Provider";
import { slugify } from "@/lib/utils";

export async function POST(request) {
  try {
    await connectDB();
    const { companyName, email, phone, password } = await request.json();

    // Validate
    if (!companyName?.trim() || !email?.trim() || !phone?.trim() || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    // Check existing
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    // Create provider document
    let slug = slugify(companyName);
    const existingSlug = await Provider.findOne({ slug });
    if (existingSlug) slug = `${slug}-${Date.now()}`;

    const provider = await Provider.create({
      name: companyName.trim(),
      slug,
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      status: "pending",
    });

    // Create user document
    const hashedPassword = await bcrypt.hash(password, 12);
    await User.create({
      name: companyName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: "provider",
      providerId: provider._id,
      authMethod: "credentials",
    });

    return NextResponse.json(
      { message: "Provider registered. Pending admin approval." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Provider registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
```

## Middleware

```javascript
// middleware.js
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Provider routes — must be approved provider
    if (pathname.startsWith("/provider")) {
      if (token?.role !== "provider") {
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
    }

    // Admin routes
    if (pathname.startsWith("/admin")) {
      if (token?.role !== "admin") {
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
    }

    // Tourist account routes
    if (pathname.startsWith("/account")) {
      if (token?.role !== "tourist") {
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/provider/:path*", "/admin/:path*", "/account/:path*"],
};
```

## Helper Functions

```javascript
// lib/auth-helpers.js
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { NextResponse } from "next/server";

// Use in API routes to check auth + role
export async function requireAuth(allowedRoles = []) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      authorized: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(session.user.role)) {
    return {
      authorized: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { authorized: true, session };
}

// Usage in API route
export async function POST(request) {
  const { authorized, session, response } = await requireAuth(["provider"]);
  if (!authorized) return response;

  // session.user.role === "provider" guaranteed here
  // session.user.providerId available
}
```

## Client-Side Auth

```javascript
// Using NextAuth on the client
"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Component() {
  const { data: session, status } = useSession();

  if (status === "loading") return <Spinner />;
  if (!session) return <button onClick={() => signIn()}>Sign In</button>;

  return (
    <div>
      <p>Welcome, {session.user.name}</p>
      <p>Role: {session.user.role}</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
```

## SessionProvider Setup

```javascript
// app/layout.js — wrap with SessionProvider
"use client";
import { SessionProvider } from "next-auth/react";

// Create a separate client component for the provider
// components/providers/AuthProvider.jsx
"use client";
import { SessionProvider } from "next-auth/react";

export default function AuthProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}

// Then in layout.js (server component):
import AuthProvider from "@/components/providers/AuthProvider";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

## Password Rules

- Minimum 8 characters
- Hash with `bcrypt.hash(password, 12)` — 12 salt rounds
- Compare with `bcrypt.compare(input, hashed)`
- Never store, log, or return plain text passwords
- Google OAuth users have `password: null`
