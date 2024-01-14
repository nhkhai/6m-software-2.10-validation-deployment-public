import styles from "./SimpleForm.module.css";
import { useState } from "react";
import Joi from "joi-browser";

const userInitialState = {
  name: "",
  email: "",
  age: "",
};

// Validation rules
const schema = {
  // Syntax:  formFieldName: Joi validation rule
  // This means name field must be a string, min length 1, max 20 and is required
  name: Joi.string().min(2).max(20).required(),
  email: Joi.string().email().required(),
  age: Joi.number().min(1).max(100).required(),
};

/* 
Where do we want to do the validation?
1. When the user types in the input box
- we need a validate method to do this
2. When the user submits the form
*/

// dotenv - a package that is used to load env variables into process.env in Node.js process.

function SimpleForm() {
  const [user, setUser] = useState(userInitialState);

  if (process.env.NODE_ENV === "development") {
    console.log("[DEV] user data", user);
  } else {
    console.log("[PROD] no data revealed");
  }

  // error can be used for general errors
  const [error, setError] = useState({});

  // For keeping track of validation errors
  const [validationErrors, setValidationErrors] = useState({});

 
  /*
    Input box onChange handler + validation
  */

  const handlerOnChange = (event) => {
    // Destructure name and value from event.target
    // e.g. "name", "a"
    // this time it will be "name", "aa"
    const { name, value } = event.target;
    // name is a variable that can be "name", "email", "age"

    // Simple way of doing validation
    // if (event.target.value < 0) setError("Age cannot be negative");

  

    // event.target.name, not the "name" field
    // because event.target name = "email", "age"
    //

    // 1. UPDATE FORM STATE
    setUser((user) => {
      return {
        ...user,
        [name]: value,
      };
    });

    // 2. VALIDATE THE FIELD
    // if there is an error, we get the message
    // else we get null
    const errorMessage = validate(event);

    // 3. UPDATE VALIDATION ERROR STATE
    setValidationErrors((validationErrors) => {
      // Shallow copy - don't mutate
      const newValidationErrors = { ...validationErrors };

      // If there is an error message
      if (errorMessage) {
        // Add that message to the validationErrors state
        // name is a variable that can be "name", "email", "age"
        newValidationErrors[name] = errorMessage;

        // newValidationErrors = { name: "name length must be 2..."}
      } else {
        // do nothing?
        // because previously, might have been error message for this field
        // we need to remove it
        // delete keyword is used to remove key/value pair from an object
        delete newValidationErrors[name];
      }

      return newValidationErrors;
    });
  };

  const validate = (event) => {
    // Insert validate function code here

    const { name, value } = event.target;

    // Create an object with the name and value to validate
    // e.g. { name: "John" },  { email: "tony@stark.com }
    // Because we are only validating this one field
    const objToValidate = { [name]: value }; // { name: "a"}, {name: "aa"}, { email : "a"}, { age: 0}
    // because [name] will compute it to "email", "age"

    // Create a sub schema to validate the field
    // e.g. { name: Joi.string().min(1).max(20).required() }
    const fieldSchema = { [name]: schema[name] };

    // To validate we use Joi.validate method
    // The syntax is Joi.validate(objToValidate, fieldSchema)
    // This method will return an object with 2 properties - error and value
    const validationResult = Joi.validate(objToValidate, fieldSchema);

    // console.log("validationResult", validationResult);

    // if there is no error, then validationResult.error will be null
    // if there is an error, we will have err message
    return validationResult.error
      ? validationResult.error.details[0].message
      : null;
  };

  /*
    Submit handler
  */
  const handlerOnSubmit = (event) => {
    event.preventDefault();
    const result = Joi.validate(user, schema, { abortEarly: false });
    const { error } = result;

    if (!error) {
      console.log(user);
      alert("Form submitted successfully!");
    } else {
      const errorData = {};

      console.log("🔴 error", error.details);

      for (const item of error.details) {
        const name = item.path[0];
        const message = item.message;
        errorData[name] = message;
      }

      console.log("errorData", errorData);

      alert("Form has errors: \n" + JSON.stringify(errorData));
    }
  };

  return (
    <div className={styles.container}>
      <h2>SimpleForm</h2>
      <form onSubmit={handlerOnSubmit}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          placeholder="Enter name"
          onChange={handlerOnChange}
          value={user.name}
        />
        {validationErrors.name && (
          <div className="error">{validationErrors.name}</div>
        )}
        <label>Email:</label>
        <input
          type="email"
          name="email"
          placeholder="Enter email address"
          onChange={handlerOnChange}
          value={user.email}
        />
        {validationErrors.email && (
          <div className="error">{validationErrors.email}</div>
        )}
        <label>Age:</label>
        <input
          type="number"
          name="age"
          placeholder="Enter age"
          onChange={handlerOnChange}
          value={user.age}
        />
        {validationErrors.age && (
          <div className="error">{validationErrors.age}</div>
        )}
        <button>Submit</button>
      </form>
    </div>
  );
}

export default SimpleForm;
