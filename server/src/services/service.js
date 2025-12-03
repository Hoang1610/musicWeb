const connection = require("../config/database");

const getAllUser = async () => {
  const [result, field] = await connection.query("select * from Users");
  return result;
};
const postUsers = async (name, email, city) => {
  const [result, field] = await connection.query(
    `insert into Users(name,email,city) values(?,?,?)`,
    [name, email, city]
  );
  return result;
};
const getUserById = async (id) => {
  const [result, field] = await connection.query(
    "select * from Users where id=?",
    [id]
  );
  return result;
};
const updateUser = async (id, name, email, city) => {
  const [result] = await connection.query(
    "update Users set name=?,email=?,city=? where id=?",
    [name, email, city, id]
  );
  return result;
};
const deleteUser = async (id) => {
  let result = connection.query("delete from Users where id=?", [id]);
};
module.exports = { getAllUser, postUsers, getUserById, updateUser, deleteUser };
