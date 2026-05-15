import Joi from "joi"

export interface QuestionFormData {
  title: string
  description: string
  isOptional: boolean
  options: { id?: string; name: string }[]
}

const optionSchema = Joi.object({
  id: Joi.string().optional(),
  name: Joi.string().trim().min(1).max(200).required().messages({
    "string.empty": "Option name is required",
    "string.max": "Option name must be at most 200 characters",
  }),
})

export const questionSchema = Joi.object<QuestionFormData>({
  title: Joi.string().trim().min(3).max(200).required().messages({
    "string.empty": "Question title is required",
    "string.min": "Question must be at least 3 characters",
    "string.max": "Question must be at most 200 characters",
  }),

  description: Joi.string().trim().max(500).allow("").optional().messages({
    "string.max": "Description must be at most 500 characters",
  }),

  isOptional: Joi.boolean().required(),

  options: Joi.array().items(optionSchema).min(2).max(10).required().messages({
    "array.min": "At least 2 options are required",
    "array.max": "Maximum 10 options allowed",
  }),
})
