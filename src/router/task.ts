import { Router } from 'express';
import { validateToken } from '../jwt/jwt';
import { check } from 'express-validator';
import { validate } from '../middlewares/validate';
import { getTasks, saveTask, editTask, deleteTask, completeTask } from '../controllers/task';

const taskRouter = Router();

taskRouter.get('/:lesson', [ validateToken, check('lesson', 'Id no valido').isMongoId(), validate ], getTasks);

taskRouter.post('/:id', [ validateToken, check('id', 'No es un id valido').isMongoId(), validate ], saveTask);

taskRouter.put('/:id', [ validateToken, check('id', 'No es un id valido').isMongoId(), validate ], editTask);

taskRouter.delete('/:id', [ validateToken, check('id', 'No es un id valido').isMongoId(), validate ], deleteTask);

taskRouter.put(
	'/complete/:id',
	[ validateToken, check('id', 'No es un id valido').isMongoId(), validate ],
	completeTask
);

export default taskRouter;
