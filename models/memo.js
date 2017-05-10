import Mongoose from 'mongoose'

const memoSchema = new Mongoose.Schema({
  title: String,
  content: String,
  labelIds: [String],
  updatedAt: Number,
})

export default Mongoose.model('memos', memoSchema)