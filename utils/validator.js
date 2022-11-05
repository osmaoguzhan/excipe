import Constants from "./constants";
import Messages from "./messages";

const Validator = () => {
  return {
    firstName: {
      required: {
        value: true,
        message: Messages.error.requiredFirstname,
      },
      minLength: {
        value: Constants.firstNameMin,
        message: Messages.error.firstNameMinLength.replace(
          "<<placeholder>>",
          Constants.firstNameMin.toString()
        ),
      },
      maxLength: {
        value: Constants.firstNameMax,
        message: Messages.error.firstNameMinLength.replace(
          "<<placeholder>>",
          Constants.firstNameMax.toString()
        ),
      },
    },
    lastName: {
      required: {
        value: true,
        message: Messages.error.requiredLastname,
      },
      minLength: {
        value: Constants.lastNameMin,
        message: Messages.error.lastNameMinLength.replace(
          "<<placeholder>>",
          Constants.lastNameMin.toString()
        ),
      },
      maxLength: {
        value: Constants.lastNameMax,
        message: Messages.error.lastNameMaxLength.replace(
          "<<placeholder>>",
          Constants.lastNameMax.toString()
        ),
      },
    },
    email: {
      required: {
        value: true,
        message: Messages.error.requiredEmail,
      },
      pattern: {
        value: Constants.emailRegex,
        message: Messages.error.invalidEmail,
      },
    },
    password: {
      required: {
        value: true,
        message: Messages.error.requiredPassword,
      },
      minLength: {
        value: Constants.passwordMin,
        message: Messages.error.passwordMinLength.replace(
          "<<placeholder>>",
          Constants.passwordMin.toString()
        ),
      },
      maxLength: {
        value: Constants.passwordMax,
        message: Messages.error.passwordMaxLength.replace(
          "<<placeholder>>",
          Constants.passwordMax.toString()
        ),
      },
    },
  };
};

export default Validator;
