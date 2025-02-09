"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express = require("express");
const db_1 = require("./db");
const db_2 = require("./db");
const app = express();
app.use(express.json());
const cors_1 = __importDefault(require("cors"));
app.use((0, cors_1.default)());
const config_1 = require("./config");
const middleware_1 = require("./middleware");
const utils_1 = require("./utils");
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const signup = yield db_1.UserModel.create({
            username: username,
            password: password,
            firstname: firstname,
            lastname: lastname,
        });
        const response = res.json({
            message: "Singnup Successfull",
        });
    }
    catch (e) {
        res.status(411).json({
            message: "User already exists",
        });
    }
}));
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    const existingUser = yield db_1.UserModel.findOne({
        username: username,
        password: password,
    });
    if (existingUser) {
        const token = jsonwebtoken_1.default.sign({
            id: existingUser._id,
        }, config_1.JWT_PASSWORD);
        res.json({
            message: "user Signin Successfully",
            token: token,
        });
    }
    else {
        res.status(403).json({
            message: "Incorrect Credentials",
        });
    }
}));
app.post("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const title = req.body.title;
    const link = req.body.link;
    const userId = req.userId;
    const content = yield db_2.ContentModel.create({
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
}));
app.get("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const content = yield db_2.ContentModel.find({
        userId: userId,
    }).populate("userId", "username");
    res.json({
        content,
    });
}));
app.delete("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const contentId = req.body.contentId;
    const deleteContent = yield db_2.ContentModel.deleteMany({
        userId,
        _id: contentId,
    });
    console.log(deleteContent);
    res.json({
        message: "content deleted",
    });
}));
app.post("/api/v1/brain/share", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const share = req.body.share;
        const userId = req.userId;
        yield db_1.LinkModel.deleteMany({ userId: userId });
        if (share) {
            const hash = (0, utils_1.random)(10);
            yield db_1.LinkModel.create({
                userId,
                hash,
            });
            res.json({
                message: `share/${hash}`,
                hash: hash,
            });
        }
        else {
            yield db_1.LinkModel.deleteOne({
                userId: userId,
            });
            res.json({
                message: "removed link",
            });
        }
    }
    catch (err) {
        console.log("error sharing brain " + err);
        res.json(500).json({
            message: "Internal server Error",
        });
    }
}));
app.post("/api/v1/brain/:sharelink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = req.params.sharelink;
    const findLink = yield db_1.LinkModel.findOne({
        hash: hash,
    });
    if (!findLink) {
        res.status(411).json({
            message: "sorry incorrect input",
        });
        return;
    }
    const content = yield db_2.ContentModel.findOne({
        userId: findLink.userId,
    });
    const user = yield db_1.UserModel.findOne({
        _id: findLink.userId,
    });
    res.json({
        username: user === null || user === void 0 ? void 0 : user.username,
        content: content,
    });
}));
app.listen(3000);
