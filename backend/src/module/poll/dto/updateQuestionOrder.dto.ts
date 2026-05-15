import Joi from "joi"
import BaseDto from "../../../common/dto/base.dto";

export class UpdateQuestionOrderDto extends BaseDto {
    static override schema = Joi.object({
        questions: Joi.array().items(
            Joi.object({
                id: Joi.string().required(),
                order: Joi.number().required(),
            }),
        ).required(),
    })
}