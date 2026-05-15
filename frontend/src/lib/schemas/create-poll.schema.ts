import Joi from "joi"

export interface CreatePollFormData {
  title: string
  slug: string
  description: string
  expiryDate: string
  expiryTime: string
  isPublic: boolean
  isAnonymousSubmissionAllowed: boolean
  isAllowedToEditAfterResponse: boolean
  accessCode: string
}

export const createPollSchema = Joi.object<CreatePollFormData>({
  title: Joi.string().trim().min(3).max(120).required().messages({
    "string.empty": "Title is required",
    "string.min": "Title must be at least 3 characters",
    "string.max": "Title must be at most 120 characters",
  }),

  slug: Joi.string()
    .trim()
    .min(3)
    .max(80)
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .required()
    .messages({
      "string.empty": "Slug is required",
      "string.min": "Slug must be at least 3 characters",
      "string.max": "Slug must be at most 80 characters",
      "string.pattern.base":
        "Slug must be lowercase letters, numbers, and hyphens only",
    }),

  description: Joi.string().trim().max(500).allow("").messages({
    "string.max": "Description must be at most 500 characters",
  }),

  expiryDate: Joi.string()
    .required()
    .custom((value, helpers) => {
      const date = new Date(value)
      if (isNaN(date.getTime())) {
        return helpers.error("any.invalid")
      }
      return value
    })
    .messages({
      "string.empty": "Expiry date is required",
      "any.invalid": "Please select a valid date",
    }),

  expiryTime: Joi.string()
    .required()
    .pattern(/^\d{2}:\d{2}(:\d{2})?$/)
    .messages({
      "string.empty": "Expiry time is required",
      "string.pattern.base": "Please enter a valid time",
    }),

  isPublic: Joi.boolean().required(),

  isAnonymousSubmissionAllowed: Joi.boolean().required(),

  isAllowedToEditAfterResponse: Joi.boolean().required(),

  accessCode: Joi.when("isPublic", {
    is: false,
    then: Joi.string()
      .trim()
      .length(6)
      .pattern(/^[a-zA-Z0-9]{6}$/)
      .required()
      .messages({
        "string.empty": "Access code is required for private polls",
        "string.length": "Access code must be exactly 6 characters",
        "string.pattern.base":
          "Access code must be 6 alphanumeric characters (letters and numbers only)",
      }),
    otherwise: Joi.string().allow("").optional(),
  }),
})
