import BaseDto from "../dto/base.dto";
import ApiError from "../utils/api-error";
import type { Request, Response, NextFunction } from "express";

const validate = (DtoClass: typeof BaseDto) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const { errors, value } = DtoClass.validate(req.body)
		
		if (errors) {
			throw ApiError.badRequest(`Invalid request data: ${DtoClass.name}`, errors)
		}
		
		req.body = value;
		next()
	}
}

export default validate;
