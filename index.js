import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import { error, log } from "console";
const port = 3000;
const app = express();

const db = new pg.Client(
    {
        user : "postgres",
        host : "localhost",
        database : "movie-review",
        password : "farhaan",
        port : 5000
    }
);

db.connect();

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static(__dirname+'/public'));

app.use(express.urlencoded({extended : true }));


app.get("/", async (req,res)=>{
    const value = await db.query("select * from list_of_movies lm join rating_of_movies rm on lm.id = rm.id;");
    if(value.rows.length===0){
        res.send("error");
    }
    else{
        // console.log(value.rows);
        res.render(__dirname+"/views/index.ejs",{movies : value.rows});
    }
    
})

app.get("/movie", async (req,res) =>{
    // console.log(req.query.id);
    const value = await db.query(`select * from list_of_movies lm join rating_of_movies rm on lm.id = rm.id where lm.id = ${Number(req.query.id)};`);
    if(value.rows.length === 0){
        res.send("error");
    }
    else{
        res.render(__dirname+"/views/movie.ejs",{movie: value.rows[0]});
    }
});

app.get("/add", (req,res)=>{
    res.render(__dirname+"/views/addmovie.ejs");
});

app.post("/submit",async (req,res)=>{
    try{
        // const result = db.query(`insert into list_of_movies (title,language) values(${req.body.title},${req.body.language});`);
        let result = await db.query('INSERT INTO list_of_movies (title, language) VALUES ($1, $2)', [req.body.title.trim(), req.body.language.trim()]);
        // console.log(result);
        result = await db.query(`select id from list_of_movies where title like '%${req.body.title.trim()}%';`);
        result = await db.query(`insert into rating_of_movies (id,rating,review) values($1,$2,$3);`,[result.rows[0].id, req.body.rating, req.body.review.trim()]);
        res.redirect("/");
    }
    catch(err){
        console.error("erorr occured : "+err);
    }
});

app.listen(port,()=> console.log(`listening at port ${port}`));