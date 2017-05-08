import Mongoose from 'mongoose'

const labelSchema = new Mongoose.Schema({
  name: String,
})

export default Mongoose.model('labels', labelSchema)