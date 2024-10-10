import client from "../../config/db.config.js";
import ApplicationError from "../../errorhandlers/application.errorhandler.js";


// Register User
export const createUser = async (name, email, password) => {
  try {
    const query = {
      text: `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`,
      values: [name, email, password],
    };
    const result =await client.query(query);
    const newUser = result.rows[0];
    return newUser;
  } catch (error) {
    if(error.code==='23505'){
      throw new ApplicationError("Email Already Exists Continue to Login",400);
    }
  }
};

// fetch User
export const getUser = async(email)=>{
try {
  const query = {text:'SELECT * FROM users WHERE email=$1',values:[email]}
  const checkUser = await client.query(query);
  const user = checkUser.rows[0];
  return user;
} catch (error) {
  throw new ApplicationError("Failed to get User",404);
}
}