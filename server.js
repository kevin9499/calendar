const { filter } = require("./search");
const express = require("express");
const { spawn } = require("child_process");
const cors = require("cors");
const app = express();
const fs = require('fs');
const { callbackify } = require("util");

app.use(cors());
app.use(express.json())
app.post("/task", (req, res, next) => {
    console.log(req.body.date);
    const date = req.body.date;
    const h = date.substring(11,16);
    const d = date.substring(8,10);
    const m = date.substring(5,7);
    const y = date.substring(0,4);
    const heure = date.substring(11,13);
    const minute = date.substring(14,16);
    console.log(d,m,y,h);
        const task = spawn(`schtasks`,
        ["/create","/tn",`MyTask${d}${m}${y}${heure}${minute}`,"/tr","C:/Users/Final/Desktop/Projet_NodeJs/serveur/exec/task.bat","/sc","once","/sd",`${d}/${m}/${y}`,"/st",`${h}`]);
            
        task.stdout.on("data", data => {
            console.log(`stdout: ${data}`);
        });

        task.stderr.on("data", data => {
            console.log(`stderr: ${data}`);
        });

        task.on('error', (error) => {
            console.log(`error: ${error.message}`);
        });

        task.on("close", code => {
            console.log(`child process exited with code ${code}`);
        });
    return
   });
 

   
app.get("/events", (req, res, next) => {
    let events = fs.readFileSync("events.json")
    events = JSON.parse(events)
    return res.end(JSON.stringify(events))
});

app.post("/events", (req, res, next) => {
    let events = fs.readFileSync("events.json")
    events = JSON.parse(events)
    const eventsFiltered = filter(req.body,events)
    let results = [];
    if(eventsFiltered.length === events.length){
        results = [...events,req.body]
    }
    console.log(results);
    const eventString = JSON.stringify(results);
    fs.writeFileSync("events.json", eventString, (erreur) => {
        console.log(erreur)
    })
    const response = {
        created: results.length>events.length
    }
    return res.send(JSON.stringify(response))
});

app.post("/event-delete", (req, res, next) => {
    let events = fs.readFileSync("events.json")
    events = JSON.parse(events)
    const eventsFiltered = filter(req.body,events)
    let results = false;
    if(eventsFiltered.length != events.length){
        results = true
    }
    const eventString = JSON.stringify(eventsFiltered);
    fs.writeFileSync("events.json", eventString, (erreur) => {
        console.log(erreur)
    })
    const date = req.body.date;
    //console.log()
    const h = date.substring(11,16);
    const d = date.substring(8,10);
    const m = date.substring(5,7);
    const y = date.substring(0,4);
    const heure = date.substring(11,13);
    const minute = date.substring(14,16);
    console.log(d,m,y,h);
        const task = spawn(`schtasks`,
        ["/delete","/tn",`MyTask${d}${m}${y}${heure}${minute}`,"/f"]);
            
        task.stdout.on("data", data => {
            console.log(`stdout: ${data}`);
        });

        task.stderr.on("data", data => {
            console.log(`stderr: ${data}`);
        });

        task.on('error', (error) => {
            console.log(`error: ${error.message}`);
        });

        task.on("close", code => {
            console.log(`child process exited with code ${code}`);
        });
    const response = {
        isDelete : results
    }
    return res.send(JSON.stringify(response))
});
app.listen(8000, () => {
 console.log("Server running on port 8000");
});    