import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Provider from "@/models/Provider";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        await connectDB();

        const user = await User.findOne({ email: credentials.email.toLowerCase() });

        if (!user) {
          throw new Error("No account found with that email");
        }

        if (!user.password) {
          throw new Error("This account uses Google login");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Incorrect password");
        }

        const result = {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };

        // For providers, attach their provider record status
        if (user.role === "provider" && user.providerId) {
          const provider = await Provider.findById(user.providerId).select("status");
          result.providerId = user.providerId.toString();
          result.providerStatus = provider?.status ?? "pending";
        }

        return result;
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      // Google sign-in: create or link tourist account
      if (account?.provider === "google") {
        await connectDB();

        const existing = await User.findOne({ email: user.email.toLowerCase() });

        if (!existing) {
          await User.create({
            email: user.email.toLowerCase(),
            name: user.name,
            role: "tourist",
            googleId: user.id,
            authMethod: "google",
            password: null,
          });
        } else if (!existing.googleId) {
          // Link Google ID to existing credentials account
          existing.googleId = user.id;
          existing.authMethod = "google";
          await existing.save();
        }
      }

      return true;
    },

    async jwt({ token, user, account }) {
      // On initial sign-in, attach role and IDs to token
      if (user) {
        token.role = user.role;
        token.userId = user.id;
        if (user.providerId) token.providerId = user.providerId;
        if (user.providerStatus) token.providerStatus = user.providerStatus;
      }

      // For Google sign-ins, look up role from DB
      if (account?.provider === "google") {
        await connectDB();
        const dbUser = await User.findOne({ email: token.email.toLowerCase() });
        if (dbUser) {
          token.role = dbUser.role;
          token.userId = dbUser._id.toString();
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.userId;
      session.user.role = token.role;
      if (token.providerId) session.user.providerId = token.providerId;
      if (token.providerStatus) session.user.providerStatus = token.providerStatus;
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
