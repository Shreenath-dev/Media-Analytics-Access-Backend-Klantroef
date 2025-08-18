import isEmpty from "is-empty";

export default function yupToFormError(validationError) {
  if (isEmpty(validationError) || !validationError.inner) {
    return {};
  }

  const errors = validationError.inner.reduce((accessor, error) => {
    accessor[error.path] = error.message;
    return accessor;
  }, {});
  return errors;
}
