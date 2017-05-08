import Mongoose from 'mongoose'

const memoSchema = new Mongoose.Schema({
  title: String,
  updatedAt: Number,
  content: String,
  labelIds: [String],
})

export default Mongoose.model('memos', memoSchema)