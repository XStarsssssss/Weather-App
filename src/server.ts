import express, { Request, Response } from "express";
import path from "path";
import axios from "axios";

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
    res.render("index", { 
        city: null, 
        temp: null, 
        desc: null, 
        img: null,
        error: null 
    });
});

app.post("/", async (req: Request, res: Response) => {
    const Name = req.body.city_search;
    const apikey = "84d70674016f7af4ac22e11031e53e09";
    const units = "metric";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${Name}&appid=${apikey}&units=${units}`;
    
    try {
        const response = await axios.get(url);
        const weatherdata = response.data;
        
        const temp = weatherdata.main.temp;
        const city = weatherdata.name;
        const description = weatherdata.weather[0].description;
        const icon = weatherdata.weather[0].icon;
        const img = `https://openweathermap.org/img/wn/${icon}@2x.png`;

        res.render("index", { 
            city: city, 
            temp: temp, 
            desc: description,
            img: img,
            error: null 
        });
    } catch (err) {
        res.render("index", { 
            city: null, 
            temp: null, 
            desc: null, 
            img: null,
            error: "City is Not Found!" 
        });
    }
});

app.listen(5000, () => {
    console.log("Server is Running on port 5000");
});