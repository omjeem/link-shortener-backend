import { pool } from ".";
import { middleware } from "./middleware";
import { updateProfile, userTypeSignIn, userTypeSignUp } from "./types";
import jwt from "jsonwebtoken"

const express = require('express');
const userRouter = new express.Router();

userRouter.post("/", async (req: any, res: any) => {
    const body = req.body
    const isValid = userTypeSignUp.safeParse(body)
    if (!isValid.success) {
        return res.status(400).json({
            message: "Invalid Body"
        })
    }
    try {
        const query = `insert into users (username, email, password) values($1, $2, $3) returning id;`;
        const values = [body.username, body.email, body.password];
        const response = await pool.query(query, values);
        const token = jwt.sign({ id: response.rows[0].id }, process.env.JWT_SECRET || "secret-key");
        return res.status(200).json(token);
    } catch (err) {
        return res.status(402).json({
            message: "Email Already exists"
        });
    }
})

userRouter.get("/", async (req: any, res: any) => {
    const body = req.body
    const isValid = userTypeSignIn.safeParse(body)
    if (!isValid.success) {
        return res.status(400).json({
            message: "Invalid Body"
        })
    }
    try {
        const query = `select id from users where username=$1 and password=$2`;
        const values = [body.username, body.password];
        const response = await pool.query(query, values);
        if (response.rows.length === 0) {
            return res.status(403).json({ message: "User not found / Invalid Credentials" })
        }
        const query2 = `select * from links where userid = $1;`
        const values2 = [response.rows[0].id]
        const links = await pool.query(query2, values2);
        const token = jwt.sign({ id: response.rows[0].id }, process.env.JWT_SECRET || "secret-key");
        return res.status(200).json({
            token,
            links : links.rows
        });
    } catch (err) {
        return res.send(err);
    }
})



userRouter.put("/", middleware, async (req: any, res: any) => {
    const body = req.body
    const isValid = updateProfile.safeParse(body)
    if (!isValid.success) {
        return res.status(400).json({
            message: "Invalid Body"
        })
    }
    try {
        const query = `update users set username = COALESCE($1, username), password = COALESCE($2, password) where id = $3 returning *;`;
        const values = [body.username, body.password, req.id];
        const response = await pool.query(query, values);
        return res.status(200).json({
            message: "Updated",
            data: response.rows[0]
        });
    } catch (err) {
        return res.send(err);
    }
})

userRouter.delete("/", middleware, async (req: any, res: any) => {
    const id = req.id
    try {
        const query = `delete from users where id = $1;`;
        const values = [id];
        const response = await pool.query(query, values);
        return res.status(200).json({
            message: "Deleted"
        });
    } catch (err) {
        return res.send("Error while deleting ! Please try again later")
    }
})

export default userRouter

