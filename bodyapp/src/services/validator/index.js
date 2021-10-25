import {useState, useEffect} from 'react';

export const EMAIL_RE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const fieldValidator = (callback, key) => {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      callback();
    }
  }, [errors]);

  const handleSubmit = () => {
    if (key === 'signup') {
      setErrors(validationRulesSignUp(values));
    }
    if (key === 'name') {
      setErrors(validationRulesName(values));
    }
    if (key === 'login') {
      setErrors(validationRulesLogin(values));
    }
    if (key === 'reset') {
      setErrors(validationRulesReset(values));
    }
    if (key === 'resetNewPasswords') {
      setErrors(validationRulesResetNewPasswords(values));
    }

    setErrors({});
    setIsSubmitting(true);
  };

  const handleChange = (name, text) => {
    const err = {...errors};
    if (err[name]) {
      delete err[name];
      setIsSubmitting(false);
    }
    setValues(currentValues => ({...currentValues, [name]: text}));
  };

  return {
    handleChange,
    handleSubmit,
    values,
    errors,
    setErrors
  };
};

const validationRulesSignUp = (values) => {
  const errors = {};
  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!EMAIL_RE.test(values.email)) {
    errors.email = 'Invalid email';
  }
  if (!values.password) {
    errors.password = 'Password is required';
  }
  if (values.password && values.password.length <= 5) {
    errors.password = 'Password length must be more than 5 characters';
  }
  if (!values.repeatPassword) {
    errors.repeatPassword = 'Password confirmation is required';
  }
  if (values.password !== values.repeatPassword) {
    errors.repeatPassword = 'Passwords are not match';
  }
  return errors;
};

const validationRulesLogin = (values) => {
  const errors = {};
  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!EMAIL_RE.test(values.email)) {
    errors.email = 'Invalid email';
  }
  if (!values.password) {
    errors.password = 'Password is required';
  }
  return errors;
};

const validationRulesName = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Name is required';
  }
  return errors;
};

const validationRulesReset = (values) => {
  const errors = {};
  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!EMAIL_RE.test(values.email)) {
    errors.email = 'Invalid email';
  }
  return errors;
};

const validationRulesResetNewPasswords = (values) => {
  const errors = {};
  if (!values.password) {
    errors.password = 'Password is required';
  }
  if (values.password && values.password.length <= 5) {
    errors.password = 'Password length must be more than 5 characters';
  }
  if (!values.repeatPassword) {
    errors.repeatPassword = 'Password confirmation is required';
  }
  if (values.password !== values.repeatPassword) {
    errors.repeatPassword = 'New password and confirmation do not match';
  }
  return errors;
};
