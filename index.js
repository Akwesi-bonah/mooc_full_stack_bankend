const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

morgan.token('body', (req) => {
    return JSON.stringify(req.body);
  });
const format = ':method :url :status :res[content-length] - :response-time ms :body';
const POST = process.env.PORT || 3001


app.use(express.json())
app.use(morgan(format))
app.use(cors())
app.use(express.static('dist'))

app.get('/status', (_request, response) => {
    response.status(200)
    .set('Content-Type', 'text/plain')
    .json({"status": 'ok'})
})

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    },
    { 
        "id": 5,
        "name": "Akwesi Bonah", 
        "number": "39-23-6423122"
      }
]


app.get('/api/persons', (_request, response) => {
    response.json(persons)
})

app.get('/info', (_request, response) => {
    const personLength = persons.length;
    const req_time = new Date()
    const message = `
        <p>Phonebook has info for ${personLength} people</p>
        <br/>
        <p>${req_time}</p>
    `;
    response.send(message);
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id)
    const person = persons.find(person => person.id === id)
    
    if (person){
        response.json(person)
    } else {
        response.status(404).end()
    }
    console.log(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})


const generateId = () => {
    const maxId = 1000000;
    let newId = Math.floor(Math.random() * maxId) + 1;;
    return newId;
};

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name) {
        return response.status(400).json({
            error: 'name  is missing'
        });
    }
    if (!body.number) {
        return response.status(400).json({
            error: 'number is missing'
        });
    }

    if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        });
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    };

    persons = persons.concat(person);

    response.json(person);
})


app.listen(POST, () => {
    console.log(`Server running on port ${POST}`)
})