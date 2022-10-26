const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const user = 'mateoap00';
const psw = process.argv[2];

const url = `mongodb+srv://${user}:${psw}@cluster0.kqfgyqp.mongodb.net/noteApp?retryWrites=true&w=majority`;
console.log(url);

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

// mongoose
//     .connect(url)
//     .then((result) => {
//         console.log('connected')

//         // const note01 = new Note({
//         //     content: 'Hello Mongo DB!',
//         //     date: new Date(),
//         //     important: true,
//         // });

//         // return note01.save();


//     }).then(() => {
//         console.log('note saved!')
//         return mongoose.connection.close()
//     })
//     .catch((err) => console.log(err));

mongoose.connect(url).then((result) => {
    Note.find({ important: true }).then(result => {
        result.forEach(note => {
            console.log(note);
        })
        mongoose.connection.close();
    });
}).catch((err) => console.log(err));
