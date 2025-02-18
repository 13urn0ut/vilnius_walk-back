const { sql } = require("../dbConnection.js");

exports.createUser = async (user) => {
  const { email, role, password } = user;

  const [newUser] = sql`
    INSERT INTO users (email, role, password)
    VALUES (${email}, ${role}, ${password})
    RETURNING *
  `;

  return newUser;
};

exports.getUserByEmail = async (email) => {
  console.log(email);

  const [user] = sql`
    SELECT users.*
    FROM users
    WHERE users.email = ${email}
  `;

  return user;
};
