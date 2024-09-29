require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const app = express();

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});
const format =
  ":method :url :status :res[content-length] - :response-time ms :body";
const POST = process.env.PORT || 3001;

app.use(express.json());
app.use(morgan(format));
app.use(cors());
app.use(express.static("dist"));



app.get("/status", (_request, response) => {
  response.status(200).set("Content-Type", "text/plain").json({ status: "ok" });
});

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
  {
    id: 5,
    name: "Akwesi Bonah",
    number: "39-23-6423122",
  },
];



app.get("/api/persons", (_request, response) => {
  Person.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((err) => {
      response.status(500).json({ error: "Failed to fetch persons" });
    });
});

app.get("/info", (_request, response) => {
  const personLength = persons.length;
  const req_time = new Date();
  const message = `
        <p>Phonebook has info for ${personLength} people</p>
        <br/>
        <p>${req_time}</p>
    `;
  response.send(message);
});

app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findById(id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).send({ error: "Person not found" });
      }
    })
    .catch(error => next(error))
});

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findByIdAndRemove(id)
    .then(() => {
      response.status(204).end();
    })
    .catch(error => next(error))
});


app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "name  is missing",
    });
  }
  if (!body.number) {
    return response.status(400).json({
      error: "number is missing",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((err) => {
      response.status(500).json({ error: "Failed to save person" });
    });
});

app.put('/api/persons/:id', (request, response, next) => {
  const {id, name, number} = request.body    
  const updatePerson = {
    name : name,
    number: number
  }

  Person.findByIdAndUpdate(request.params.id, updatePerson, {new: true})
  .then(updatePerson => {
    response.json(updatePerson)
  })
  .catch(error => next(error))
})




const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)

app.listen(POST, () => {
  console.log(`Server running on port ${POST}`);
});
