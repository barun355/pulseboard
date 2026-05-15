import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto";

class UpdateQuestionDto extends BaseDto {
    static override schema = Joi.object({
        questionId: Joi.string().required(),
        title: Joi.string().required().min(3).max(100),
        description: Joi.string().optional().min(3).max(500),
        isOptional: Joi.boolean().required(),
    })
}

export default UpdateQuestionDto;