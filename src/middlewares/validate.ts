import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

export const validate = (req: Request, res: Response, next: Function) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.send({ error: errors.array()[0].msg });
	}
	next();
};
