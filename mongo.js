const mongoose = require('mongoose')

if ( process.argv.length< 3) {
  console.log('Give me a password bby')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
`mongodb+srv://full_stack_zach:${password}@cluster0-azqkn.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema ({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if ( process.argv.length === 3) {
    Person.find({}).then(result => {
      result.forEach(person => {
        console.log(person)
        mongoose.connection.close()
      })
    })
  } else {
    const person = new Person ({
      name: name,
      number: number,
    })
    person.save().then(request => {
      console.log(`Added ${name} number: ${number} to phonebook`)
      mongoose.connection.close()
    })
  }
