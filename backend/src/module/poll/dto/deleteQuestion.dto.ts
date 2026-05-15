import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto";


class DeleteQuestionDto extends BaseDto {
  static override schema = Joi.object({
    pollId: Joi.string().required(),
    questionId: Joi.string().required(),
  });
}

export default DeleteQuestionDto;