export const validateBody = (schema) => {
  return (req, res, next) => {
    console.log("Validating request body:", req.body); // debug log

    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      console.log("Validation failed:", error.details); // debug log
      return res.status(400).json({
        status: 'fail',
        message: 'Validation failed',
        errors: error.details.map(d => d.message),
      });
    }

    req.body = value;
    next();
  };
};
