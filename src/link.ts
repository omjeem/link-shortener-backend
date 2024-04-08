const express = require('express');
const linkRouter = new express.Router();
import { pool } from ".";
import { middleware } from "./middleware";



function generateRandomId(length: number) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        randomString += charset[randomIndex];
    }
    return randomString;
}

linkRouter.post("/",middleware, async (req : any, res: any) => {
    try {
        const url = req.body.url;
        try {
            const r = new URL(url)
        } catch (err) {
            return res.status(403).json({
                message : "Invalid URL"
            });
        }
        const id = generateRandomId(4);
        const query = `insert into links (id, url, userId) values ($1, $2, $3);`
        const values = [id, url, req.id]
        const response = await pool.query(query, values);
        const baseUrl = `${req.protocol}://${req.get('host')}/${id}`;
        return res.send(baseUrl)

    } catch (err) {
        console.log(err)
        return res.send("Please try again later")
    }
})


export default linkRouter

