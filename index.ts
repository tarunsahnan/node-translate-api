import express, { Request, Response } from "express";
const translatte = require("translatte");
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.post("/translate", (req: Request, res: Response) => {
  console.log("aaaaa", req.body);
  translatte(req.body.text, { from: "en", to: "fr" })
    // @ts-expect-error
    .then((result) => {
      console.log(result.text);
      res.json(result);
    })
    // @ts-expect-error
    .catch((err) => {
      console.error(err);
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
