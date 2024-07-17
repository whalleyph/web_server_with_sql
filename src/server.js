import { app } from "./support/setupExpress.js";
import { query } from "./support/db.js";
import pg from "pg";

//http request body
const dbURL = process.env.DATABASE_URL;
console.log(dbURL.length);

const client = new pg.Client({
    connectionString: dbURL,
    ssl: true,
});

client.connect();

//An example route that makes an SQL query to the db.
app.get("/messages", async (req, res) => {
    try {
        const dbResult = await query("select * from chat_messages");
        res.json(dbResult.rows);
    } catch (error) {
        console.error("error handling db-check: ", error);
    }
});

app.get("/messages/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const dbResult = await query(
            "select * from chat_messages where id = $1",
            [id]
        );
        res.json(dbResult.rows);
    } catch (error) {
        console.error("error handling db-check: ", error);
    }
});

app.post("/messages", async (req, res) => {
    const newMessage = req.body;
    const dbResult = await query(
        "INSERT INTO chat_messages (text, author) VALUES ($1, $2) returning *",
        [newMessage.text, newMessage.author]
    );
    res.json(dbResult.rows);
});

// use the environment variable PORT, or 4000 as a fallback
const PORT = process.env.PORT ?? 4000;

app.listen(PORT, () => {
    console.log(
        `Your express app started listening on ${PORT}, at ${new Date()}`
    );
});
