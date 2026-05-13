import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto";

class PollDto extends BaseDto {
    static override schema = Joi.object({
        slug: Joi.string().required().min(3).max(50),
        title: Joi.string().required().min(3).max(100),
        description: Joi.string().required().min(3).max(500),
        isPublic: Joi.boolean().required(),
        expiresAt: Joi.date().required(),
        isAnonymousSubmissionAllowed: Joi.boolean().required(),
    })
}

export default PollDto;