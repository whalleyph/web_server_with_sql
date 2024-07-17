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

app.get("/", (req, res) => {
    res.json({
        outcome: "success",
        message: "hello world!  Try /sum/1/2 or /db-check",
    });
});

//An example route that makes an SQL query to the db.
app.get("/db-check", async (req, res) => {
    try {
        const dbResult = await query("select * from chat_messages");
        res.json(dbResult.rows);
    } catch (error) {
        console.error("error handling db-check: ", error);
    }
});

// use the environment variable PORT, or 4000 as a fallback
const PORT = process.env.PORT ?? 4000;

app.listen(PORT, () => {
    console.log(
        `Your express app started listening on ${PORT}, at ${new Date()}`
    );
});
