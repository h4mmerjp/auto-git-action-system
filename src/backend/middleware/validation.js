const Joi = require('joi');

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().min(1).required(),
  lastName: Joi.string().min(1).required()
});

const projectSchema = Joi.object({
  name: Joi.string().min(1).required(),
  description: Joi.string().allow(''),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).required(),
  status: Joi.string().valid('active', 'completed', 'on-hold', 'cancelled').default('active')
});

const taskSchema = Joi.object({
  title: Joi.string().min(1).required(),
  description: Joi.string().allow(''),
  projectId: Joi.number().integer().required(),
  parentId: Joi.number().integer().allow(null),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).required(),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium'),
  status: Joi.string().valid('todo', 'in-progress', 'completed', 'blocked').default('todo'),
  progress: Joi.number().min(0).max(100).default(0)
});

const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      error: 'Validation Error',
      details: error.details[0].message 
    });
  }
  next();
};

const validateProject = (req, res, next) => {
  const { error } = projectSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      error: 'Validation Error',
      details: error.details[0].message 
    });
  }
  next();
};

const validateTask = (req, res, next) => {
  const { error } = taskSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      error: 'Validation Error',
      details: error.details[0].message 
    });
  }
  next();
};

module.exports = {
  validateUser,
  validateProject,
  validateTask
};
