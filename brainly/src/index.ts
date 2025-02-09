import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import connectDB from "./db";
import jwt from "jsonwebtoken";
import express = require("express");
import { LinkModel, UserModel } from "./db";
import { ContentModel } from "./db";
const app = express();
app.use(express.json());
import cors from "cors";
app.use(cors());
import { JWT_PASSWORD } from "./config";
import { userMiddleware } from "./middleware";
import { random } from "./utils";

connectDB();
console.log("Database URL from the index.ts:", process.env.DATABASE_URL);
app.post("/api/v1/signup", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const signup = await UserModel.create({
      username: username,
      password: password,
      firstname: firstname,
      lastname: lastname,
    });
    const response = res.json({
      message: "Singnup Successfull",
    });
  } catch (e) {
    res.status(411).json({
      message: "User already exists",
    });
  }
});

app.post("/api/v1/signin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const existingUser = await UserModel.findOne({
    username: username,
    password: password,
  });

  if (existingUser) {
    const token = jwt.sign(
      {
        id: existingUser._id,
      },
      JWT_PASSWORD
    );
    res.json({
      message: "user Signin Successfully",
      token: token,
    });
  } else {
    res.status(403).json({
      message: "Incorrect Credentials",
    });
  }
});

app.post("/api/v1/content", userMiddleware, async (req, res) => {
  const title = req.body.title;
  const link = req.body.link;
  const userId = req.userId;

  const content = await ContentModel.create({
    title: title,
    link: link,
    type: req.body.type,
    userId: userId,
    tags: [],
  });
  console.log(content);
  res.json({
    message: "Content added",
  });
});
app.get("/api/v1/content", userMiddleware, async (req, res) => {
  const userId = req.userId;

  const content = await ContentModel.find({
    userId: userId,
  }).populate("userId", "username");
  res.json({
    content,
  });
});

app.delete("/api/v1/content", userMiddleware, async (req, res) => {
  const userId = req.userId;
  const contentId = req.body.contentId;
  const deleteContent = await ContentModel.deleteMany({
    userId,
    _id: contentId,
  });
  console.log(deleteContent);
  res.json({
    message: "content deleted",
  });
});

app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
  try {
    const share = req.body.share;
    const userId = req.userId;

    await LinkModel.deleteMany({ userId: userId });
    if (share) {
      const hash = random(10);
      await LinkModel.create({
        userId,
        hash,
      });
      res.json({
        message: `share/${hash}`,
        hash: hash,
      });
    } else {
      await LinkModel.deleteOne({
        userId: userId,
      });
      res.json({
        message: "removed link",
      });
    }
  } catch (err) {
    console.log("error sharing brain " + err);
    res.json(500).json({
      message: "Internal server Error",
    });
  }
});

app.post("/api/v1/brain/:sharelink", async (req, res) => {
  const hash = req.params.sharelink;
  const findLink = await LinkModel.findOne({
    hash: hash,
  });
  if (!findLink) {
    res.status(411).json({
      message: "sorry incorrect input",
    });
    return;
  }
  const content = await ContentModel.findOne({
    userId: findLink.userId,
  });
  const user = await UserModel.findOne({
    _id: findLink.userId,
  });
  res.json({
    username: user?.username,
    content: content,
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port: ${process.env.PORT || 3000}`);
});
