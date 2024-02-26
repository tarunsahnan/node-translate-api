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
const express_1 = __importDefault(require("express"));
const node_cache_1 = __importDefault(require("node-cache"));
// @ts-expect-error: This library does not have types
const translatte_1 = __importDefault(require("translatte"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Cache with a timeout of 300 seconds (5 minutes)
const translationCache = new node_cache_1.default({ stdTTL: 300 });
app.use(express_1.default.json());
app.post("/translate", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (typeof req.body.text !== "string" && !req.body.text) {
            return res
                .status(400)
                .json({ error: "Text to translate is missing in the request body." });
        }
        const text = req.body.text.trim();
        if (text === "") {
            return res
                .status(400)
                .json({ error: "Text to translate should not be an empty string." });
        }
        let translation = translationCache.get(text);
        if (!translation) {
            const translationResult = yield (0, translatte_1.default)(text, {
                from: "en",
                to: "fr",
            });
            translation = translationResult.text;
            translationCache.set(text, translation);
        }
        res.json({ translation });
    }
    catch (error) {
        console.error("Error:", error);
        res
            .status(500)
            .json({ error: "An error occurred while translating the text." });
    }
}));
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
