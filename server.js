"using strict"

const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const bands = [
    {id:1, name:"Green Day", date:"1986", genre:"Pop Punk", active:"Active"},
    {id:2, name:"Iron Maiden", date:"1975", genre:"Heavy Metal", active:"Active"},
    {id:3, name:"Nirvana", date:"1987", genre:"Grunge", active:"Not Active"},
    {id:4, name:"Metallica", date:"1981", genre:"Thrash Metal", active:"Active"},
    {id:5, name:"Modest Mouse", date:"1992", genre:"Indie", active:"Active"},
    {id:6, name:"Kero Kero Bonito", date:"2011", genre:"Indie Pop", active:"Active"}
]

app.get('/api/bands', (req,res)=>{
    res.send(bands);
});

app.get('/api/bands/:id', (req,res)=>{
    const requestedId = parseInt(req.params.id);
    const band = bands.find(b =>b.id === requestedId);

    if(!band) {
        res.status(404).send(`The band with id ${requestedId} was not found`);
        return;
    }

    res.send(band);
});

//render our html page
app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/index.html');
});

app.get('/', (req,res)=>{
    res.sendFile(__dirname + '/index.html');
});

function validateBand(band) {
    const schema = {
        name:Joi.string().min(3).required(),
        date:Joi.string().min(4).required(),
        genre:Joi.string().required(),
        active:Joi.string().required()
    }

    return Joi.validate(band, schema);
}

app.post('/api/bands', (req,res)=>{
    const result = validateBand(req.body);

    if(result.error){
        res.status(400).send(result.error.details[0].message);
    }

    const band = {
        id:bands.length + 1,
        name : req.body.name,
        date : req.body.date,
        genre : req.body.genre,
        active : req.body.active
    }

    console.log("name is: " + req.body.name);
    bands.push(band);
    res.send(band);
});

// update a band
app.put('/api/bands/:id', (req, res)=>{
    const requestedId = parseInt(req.params.id);
    const band = bands.find(b =>b.id === requestedId);

    // no band with a matching id in array
    if (!band) {
        res.status(404).send(`The band with id ${requestedId} was not found`);
        return;
    }

    // validating band with schema
    const result = validateBand(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    // update array
    band.name = req.body.name;
    band.date = req.body.date;
    band.genre = req.body.genre;
    band.active = req.body.active;
    res.send(band);
});

app.delete('/api/bands/:id', (req,res)=>{
    const requestedId = parseInt(req.params.id);
    const band = bands.find(b =>b.id === requestedId);

    //no song with matchin id in array
    if(!band) {
        res.status(404).send(`The band with id ${requestedId} was not found`);
        return;
    }

    // band exists so the deletion can move forward
    let index = bands.indexOf(band);
    bands.splice(index,1);
    res.send(band);
});

//listen
const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
});