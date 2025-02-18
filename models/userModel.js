const { sql } = require("../dbConnection.js");

exports.createUser = async (user) => {
  const { email, role, password } = user;

  const [newUser] = await sql`
    INSERT INTO users (email, role, password)
    VALUES (${email}, ${role}, ${password})
    RETURNING id, email, role
  `;

  return newUser;
};

exports.getUserByEmail = async (email) => {
  const [user] = await sql`
    SELECT users.*
    FROM users
    WHERE users.email = ${email}
  `;

  return user;
};

exports.getUserById = async (id) => {
  const [user] = await sql`
    SELECT users.*
    FROM users
    WHERE users.id = ${id}
  `;

  return user;
};
