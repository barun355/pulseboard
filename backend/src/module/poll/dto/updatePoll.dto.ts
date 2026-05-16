import Joi from "joi"
import BaseDto from "../../../common/dto/base.dto"


export class UpdatePollDto extends BaseDto {
    static override schema = Joi.object({
        title: Joi.string().optional(),
        description: Joi.string().optional(),
        status: Joi.string().valid("draft", "published", "closed", "active").optional(),
        isPublic: Joi.boolean().optional(),
        expiresAt: Joi.date().iso().optional(),
        isAnonymousSubmission: Joi.boolean().optional(),
        accessCode: Joi.string().optional(),
        isAllowedToEditAfterSubmission: Joi.boolean().optional(),
        isPublicResponseAnalyticsAllowed: Joi.boolean().optional(),
    })
}