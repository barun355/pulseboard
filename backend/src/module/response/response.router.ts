import { Router } from "express"
import ResponseSubmitDto from "./dto/responseSubmit.dto";
import validate from "../../common/middleware/validate.middleware";
import { getPollForSubmission, getPublicPollAnalytics, submitResponse } from "./response.controller";


const router = Router()

router.get("/:pollId", getPollForSubmission)
router.get("/:pollId/analytics", getPublicPollAnalytics)
router.post("/:pollId/response", validate(ResponseSubmitDto), submitResponse)

export default router;