export const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      const validated = await schema.parseAsync(req.body);
      req.body = validated;
      next();
    } catch (error) {
      const formattedErrors = Array.isArray(error.errors)
        ? error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message
          }))
        : [{ message: error.message }];

      res.status(400).json({
        error: 'Validação falhou',
        details: formattedErrors
      });
    }
  };
};
