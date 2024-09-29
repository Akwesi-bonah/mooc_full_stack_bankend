const mongoose = require("mongoose")

let get = false
if (process.argv.length === 3) {
    get = true
} else if (process.argv.length < 3) {
    console.log('Give password as argument')
    process.exit(1)
} else if (process.argv.length < 4) {
    console.log("Give name as argument")
    process.exit(1)
} else if (process.argv.length < 5) {
    console.log('Give number as argument')
    process.exit(1)
}

// command line data
const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://mooc_user:${password}@mooc.zggfd.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=mooc`

// setup connection
mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (!get) {
    const person = new Person({
        name: name,
        number: number
    })

    person.save().then(() => {
        console.log(`Added ${name} ${number} to phonebook`)
        mongoose.connection.close()
    }).catch(err => {
        console.error("Error saving to phonebook:", err)
        mongoose.connection.close()
    })
} else {
    console.log('phonebook:')
    Person.find({}).then(persons => {
        persons.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    }).catch(err => {
        console.error("Error fetching persons:", err)
        mongoose.connection.close()
    })
}
