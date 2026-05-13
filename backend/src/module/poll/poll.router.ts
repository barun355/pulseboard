import { Router } from "express";
import {
  createPoll,
  addQuestion,
  updateQuestion,
  updatePollStatus,
  getPoll,
  submitResponse,
  getResults,
} from "./poll.controller";

const router = Router();

router.post("/poll", createPoll);
router.post("/poll/:pollId/questions/add", addQuestion);
router.post("/poll/:pollId/questions/update", updateQuestion);
router.post("/poll/:pollId/response", submitResponse);

router.get("/poll/:pollId", getPoll);
router.get("/poll/:pollId/results", getResults);

router.patch("/poll/:pollId/status", updatePollStatus);

export default router;
