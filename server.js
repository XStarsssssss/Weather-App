const express = require("express");
const https = require("https");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index", { 
        city: null, 
        temp: null, 
        desc: null, 
        img: null,
        error: null 
    });
});

app.post("/" , (req , res)=>{
    const Name = req.body.city_search;
    const apikey = `84d70674016f7af4ac22e11031e53e09`;
    const units = `metric`;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${Name}&appid=${apikey}&units=${units}`;
    
    https.get(url, (respond) => {


        if (respond.statusCode !== 200) {
            return res.render("index", { 
                city: null, 
                temp: null, 
                desc: null, 
                img: null,
                error: `City is Not Found!` 
            });
        }

        respond.on("data", (data) => {
            const weartherdata = JSON.parse(data);
            const temp = weartherdata.main.temp;
            const city = weartherdata.name;
            const description = weartherdata.weather[0].description;
            const icon = weartherdata.weather[0].icon;
            const img = `https://openweathermap.org/img/wn/${icon}@2x.png`;
            

            res.render("index", { 
                city: city, 
                temp: temp, 
                desc: description,
                img : img,
                error: null 
            });
        });
        
    });
});

app.listen(5000 , ()=>{
    console.log("Server is Running on port 5000");
});