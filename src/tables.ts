import { pool } from ".";

export async function createTable() {
  try {

    const user = await pool.query(`
        CREATE Table IF NOT EXISTS users(
          id SERIAL PRIMARY KEY,
          username varchar(50),
          email varchar(255) unique not null,
          password varchar(255) not null
        ); 
     `)
    const link = await pool.query(`
        CREATE TABLE IF NOT EXISTS links(
            id varchar(8) PRIMARY KEY,
            url VARCHAR(255),
            count INT DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('Asia/Kolkata', CURRENT_TIMESTAMP),
            userId INTEGER REFERENCES users(id) ON DELETE CASCADE
          );
      `)
    console.log("Table Created Successfully")
  } catch (err) {
    console.log(err)
  }

}
export async function deleteTables() {
  try {
    await pool.query(`drop table links`);
    await pool.query(`drop table users`);
    console.log("Table Deleted Successfully")

  } catch (err) {
    console.log(err)
  }
}