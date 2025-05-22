export const COOKIE_OPTIONS = {
  httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
  secure: process.env.NODE_ENV === "production", // Ensures cookies are sent over HTTPS in production
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  sameSite: "strict" as "strict", // Prevents CSRF attacks
};
