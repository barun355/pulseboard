import Joi from "joi"
import BaseDto from "../../../common/dto/base.dto";

class QuestionDto extends BaseDto {
    static override schema = Joi.object({
        title: Joi.string().required().min(3).max(100),
        description: Joi.string().optional().min(3).max(500),
        isOptional: Joi.boolean().required(),
        order: Joi.number().required(),
        options: Joi.array().items(
            Joi.object({
                name: Joi.string().required().min(1).max(100),
                value: Joi.string().required().min(1).max(100),
                order: Joi.number().required(),
            })
        ).min(2).required(),
    })
}

export default QuestionDto;