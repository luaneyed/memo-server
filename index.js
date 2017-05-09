/* External Dependencies */
import Express from 'express'
import Cors from 'cors'
import BodyParser from 'body-parser'
import Mongoose from 'mongoose'

/* Internal Dependencies */
import CRUDs from './crud'

const db = Mongoose.connection
db.on('error', console.error)
db.once('open', () => {
  console.log('Connected to mongod server')
})
Mongoose.Promise = Promise
Mongoose.connect('mongodb://localhost/memo')

const app = Express()
app.use(Cors())
app.use(BodyParser.urlencoded({ extended: true }))
app.use(BodyParser.json())

let MainPage = "<div style='white-space: pre; font-family: sans-serif'>"
MainPage += '<h1>API Specification</h1>'

CRUDs.forEach(({ method, path, description, handler }) => {
  app[method.toLowerCase()](path, handler)

  MainPage += `\n\n<h3>${description}</h3>`
  MainPage += `<strong>${method}</strong>   ${path}`
})

app.get('/', (req, res) => {
  res.send(MainPage)
})

const port = 8081

app.listen(port, () => {
  console.log(`Express server has started on port ${port}`)
})
