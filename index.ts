import express, { Request, Response } from "express";
import NodeCache from "node-cache";
// @ts-expect-error: This library does not have types
import translatte from "translatte";

const app = express();
const port = process.env.PORT || 3000;

// Cache with a timeout of 300 seconds (5 minutes)
const translationCache = new NodeCache({ stdTTL: 300 });

app.use(express.json());

app.post("/translate", async (req: Request, res: Response) => {
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
      const translationResult = await translatte(text, {
        from: "en",
        to: "fr",
      });
      translation = translationResult.text;
      translationCache.set(text, translation);
    }
    res.json({ translation });
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
