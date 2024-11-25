export const validator = (schema) => (values) => {
    const { error } = schema.validate(values, { abortEarly: false });
    if (!error) return {};
  
    const errors = {};
    error.details.forEach((detail) => {
      errors[detail.path[0]] = detail.message;
    });
    return errors;
  };