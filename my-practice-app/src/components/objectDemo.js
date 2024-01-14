const obj = {};

// name is variable
const name = "username";

obj[name] = "admin";

console.log(obj);

// { name: "admin "}?

obj["name"] = "Tony Stark";

console.log(obj);

// name var is evaluated to be "username"
delete obj[name];

console.log(obj);
