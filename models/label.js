import Mongoose from 'mongoose'

const labelSchema = new Mongoose.Schema({
  name: String,
})

labelSchema.statics.isUnoccupiedName = function(name) {
  return new Promise(
    (res, rej) => {
      this.findOne({ name }, {}, (err, label) => {
        if (label)
          rej(label)
        else
          res()
      })
    })
}

export default Mongoose.model('labels', labelSchema)