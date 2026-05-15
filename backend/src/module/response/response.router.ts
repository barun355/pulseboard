import { Router } from "express"
import ResponseSubmitDto from "./dto/responseSubmit.dto";
import validate from "../../common/middleware/validate.middleware";
import { getPollForSubmission, submitResponse } from "./response.controller";


const router = Router()

router.get("/:pollId", getPollForSubmission)
router.post("/:pollId/response", validate(ResponseSubmitDto), submitResponse)

export default router;