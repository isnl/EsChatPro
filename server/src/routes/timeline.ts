import express from "express";
import { Timeline } from "../schema";
const router = express.Router();
router.get("/", async function (req, res) {
  const list = await Timeline.find().sort({ time: -1 });
  const total = await Timeline.countDocuments();
  res.json({
    code: 200,
    data: {
      list,
      total,
    },
  });
});
export default router;
