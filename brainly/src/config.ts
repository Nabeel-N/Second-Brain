import dotenv from "dotenv";
dotenv.config();

// Access environment variables
const MONGODB_URI = process.env.DATABASE_URL || "";
const PORT = process.env.PORT || 3000;
export const JWT_PASSWORD = process.env.JWT_PASSWORD || "";

console.log("Database URLfrom config.ts:", MONGODB_URI);
console.log("Server running on port:", PORT);
