"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_PASSWORD = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Access environment variables
const MONGODB_URI = process.env.DATABASE_URL || "";
const PORT = process.env.PORT || 3000;
exports.JWT_PASSWORD = process.env.JWT_PASSWORD || "";
console.log("Database URLfrom config.ts:", MONGODB_URI);
console.log("Server running on port:", PORT);
