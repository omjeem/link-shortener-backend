import express from 'express';
import dotenv from 'dotenv'
import { createTable, deleteTables } from './tables';
import path from 'path';
import userRouter from './user';
import linkRouter from './link';
import { Pool } from 'pg';
import cors from "cors"

dotenv.config()
export const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})


const app = express();
app.use(cors())
app.use(express.json())
app.use("/user", userRouter)
app.use("/link", linkRouter)

// createTable() // Uncomment and run the following command when creating the table, then comment out
// deleteTables() // Uncomment and run the following command when deleting the table, then comment out


app.get("/:id", async (req, res) => {
    const id = req.params.id
    try {
        const query = `update links set count=count+1  where id = $1 returning url;`
        const values = [id]
        const response = await pool.query(query, values)
        return res.redirect(response.rows[0]["url"])
    } catch (err) {
        return res.sendFile(path.join(__dirname, "..", 'invalidURL.html'));
    }
})


const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})