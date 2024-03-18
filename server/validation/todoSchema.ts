import Joi from 'joi';

const todoSchema = Joi.object({
  id: Joi.string().required(),
  todo: Joi.string().required(),
  isChecked: Joi.boolean().required(),
});

const todosSchema = Joi.alternatives().try(
  todoSchema,
  Joi.array().items(todoSchema)
);



export default todosSchema;
