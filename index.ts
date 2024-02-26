import express, { Request, Response } from "express";
const translatte = require("translatte");
const NodeCache = require("node-cache");

const app = express();
const port = process.env.PORT || 3000;

const translationCache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

app.use(express.json());

app.post("/translate", async (req: Request, res: Response) => {
  try {
    console.log("req.body.textreq.body.text", req.body.text);

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

    const translationResult = await translatte(text, {
      from: "en",
      to: "fr",
    });

    res.json({ translation: translationResult.text });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while translating the text." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
