import { Router } from "express";
import {
  createPoll,
  addQuestion,
  updateQuestion,
  updatePollStatus,
  getPollById,
  getResults,
  getPolls,
  deleteQuestion,
  deleteOption,
  updateOptions,
  addOptions,
  updateQuestionOrder,
  updatePoll,
} from "./poll.controller";
import validate from "../../common/middleware/validate.middleware";
import PollDto from "./dto/poll.dto";
import QuestionDto from "./dto/question.dto";
import PollSubmitDto from "../response/dto/responseSubmit.dto";
import DeleteQuestionDto from "./dto/deleteQuestion.dto";
import DeleteOptionDto from "./dto/deleteOption.dto";
import UpdateQuestionDto from "./dto/updateQuestion.dto";
import UpdateOptionDto from "./dto/udpateOption.dto";
import AddOptionDto from "./dto/addOption.dto";
import { UpdateQuestionOrderDto } from "./dto/updateQuestionOrder.dto";
import { UpdatePollDto } from "./dto/updatePoll.dto";

const router = Router();

router.post("/", validate(PollDto), createPoll);
router.patch("/:pollId", validate(UpdatePollDto), updatePoll)

router.post("/:pollId/questions/add", validate(QuestionDto), addQuestion);

// for udpating the poll meta data
router.post("/:pollId/questions/update", validate(UpdateQuestionDto), updateQuestion);

router.patch("/:pollId/status", updatePollStatus);
router.patch("/:pollId/questions/order", validate(UpdateQuestionOrderDto), updateQuestionOrder);

// for udpating the options of a question
router.patch("/:pollId/questions/:questionId/option/updated", validate(UpdateOptionDto), updateOptions);

// for adding new options to an existing question
router.post("/:pollId/questions/:questionId/options/add", validate(AddOptionDto), addOptions);

router.delete("/:pollId/questions/:questionId", validate(DeleteQuestionDto), deleteQuestion);
router.delete("/:pollId/questions/:questionId/option/:optionId", validate(DeleteOptionDto), deleteOption);

router.get("/", getPolls);
router.get("/:pollId", getPollById);
router.get("/:pollId/results", getResults);


export default router;
