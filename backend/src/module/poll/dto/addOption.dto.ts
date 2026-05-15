import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto";

class AddOptionDto extends BaseDto {
  static override schema = Joi.object({
    options: Joi.array().items(
      Joi.object({
        name: Joi.string().required().min(1).max(100),
        value: Joi.string().required().min(1).max(100),
        order: Joi.number().required(),
      })
    ).min(1).required(),
  })
}

export default AddOptionDto;
