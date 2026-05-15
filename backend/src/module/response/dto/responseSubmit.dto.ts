import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto";

class ResponseSubmitDto extends BaseDto {
    static override schema = Joi.object({
        responses: Joi.array().items(
            Joi.object({
                questionId: Joi.string().required(),
                optionId: Joi.string().optional().allow(null), // for open ended questions
            })
        ).required(),
        feedback: Joi.string().allow(null).optional(),
        rating: Joi.number().integer().min(1).max(5).allow(null).optional(),
        accessCode: Joi.string().optional().max(6), // for private polls
        startedAt: Joi.date().required(),
        spendTimePerQuestion: Joi.object().required(),
        locale: Joi.string().required(),
        timezone: Joi.string().required(),
        screenResolution: Joi.string().allow(null).optional(),
        utmSource: Joi.string().allow(null).optional(),
        utmMedium: Joi.string().allow(null).optional(),
        utmCampaign: Joi.string().allow(null).optional(),
        referrer: Joi.string().allow(null).optional(),
    })
}

export default ResponseSubmitDto;