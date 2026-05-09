import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// /cart is intentionally public — guests can view and manage their cart freely.
// Login is enforced at checkout time (Summary component) and for /wishlist (middleware).
const isProtectedRoute = createRouteMatcher(["/wishlist(.*)"]);

export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) {
        await auth.protect();
    }
});

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
    ],
};
