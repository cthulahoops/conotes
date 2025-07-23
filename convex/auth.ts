import { convexAuth } from "@convex-dev/auth/server";
import GitHub from "@auth/core/providers/github";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [GitHub],
  callbacks: {
    async createOrUpdateUser(ctx, args) {
      const { profile } = args;
      
      if (!profile.email) {
        console.log("User has no email, denying access");
        throw new Error("Email is required for account creation");
      }

      // Check if email is in allowlist
      const allowedUser = await ctx.db
        .query("allowlist")
        .filter((q) => q.eq(q.field("email"), profile.email))
        .first();

      if (!allowedUser) {
        console.log(`Access denied for email: ${profile.email}`);
        throw new Error("Access denied. Your email is not on the allowlist.");
      }

      console.log(`Access granted for email: ${profile.email}`);
      
      // If user already exists, return their ID
      if (args.existingUserId) {
        return args.existingUserId;
      }

      // Create new user
      const userId = await ctx.db.insert("users", {
        name: profile.name,
        email: profile.email,
        image: profile.image,
        emailVerified: profile.emailVerified,
      });

      return userId;
    },
  },
});
