// https://dev.to/mr_ali3n/folder-structure-for-nodejs-expressjs-project-435l
// For reference when developing this further
import express from "express";
const app = express();
import cors from "cors";

const corsOptions = {
  origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));

app.get("/api", cors(corsOptions), (req, res) => {
  res.json({ fruits: ["apple", "orange", "banana"] });
  return true;
});

app.listen(8080, () => {
  console.log("Server started on port 8080..");
});
