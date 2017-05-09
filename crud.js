/* External Dependencies*/
import keyMirror from 'keymirror'

/* Internal Dependencies */
import { Label, Memo } from './models'

const HTTP = keyMirror({
  GET: null,
  POST: null,
  PUT: null,
  DELETE: null,
})

const ERROR = {
  DATABASE_FAILURE: '데이터베이스 오류입니다.',
  NONEXISTENT_LABEL: '라벨이 존재하지 않습니다.',
  OCCUPIED_LABEL_NAME: '해당 라벨 이름이 이미 존재합니다. 라벨 이름은 겹칠 수 없습니다.',
}
Object.keys(ERROR).forEach(error => {
  ERROR[error] = { errorMessage: ERROR[error] }
})

export default [
  {
    method: HTTP.GET,
    path: '/labels',
    description: 'List all labels',
    handler: (req, res) => {
      Label.find({}, {}, (err, labels) => {
        if (err)
          return res.status(500).send(ERROR.DATABASE_FAILURE)
        res.json(labels)
      })
    },
  },
  {
    method: HTTP.GET,
    path: '/label/:labelId',
    description: 'Get a label (FOR DEBUG)',
    handler: (req, res) => {
      Label.findById(req.params.labelId, {}, (err, label) => {
        if (err)
          return res.status(500).send(ERROR.DATABASE_FAILURE)
        res.json(label)
      })
    },
  },
  {
    method: HTTP.POST,
    path: '/label',
    description: 'Create a label',
    handler: (req, res) => {
      const { name = "" } = req.body
      const newLabel = new Label({ name })
      Label.isUnoccupiedName(name)
        .then(() => {
          newLabel.save((err, label) => {
            if (err)
              return console.error(err)
            res.json(label)
          })
        })
        .catch(() => {
          res.status(500).send(ERROR.OCCUPIED_LABEL_NAME)
        })
    },
  },
  {
    method: HTTP.PUT,
    path: '/label/:labelId',
    description: 'Update a label',
    handler: (req, res) => {
      Label.findById(req.params.labelId, (err, label) => {
        if(err) return res.status(500).json(ERROR.DATABASE_FAILURE)
        if(!label) return res.status(404).json(ERROR.NONEXISTENT_LABEL)

        const { name = "" } = req.body

        const doUpdate = () => {
          if (name)
            label.name = name

          label.save(function(err){
            if(err) res.status(500).json(ERROR.DATABASE_FAILURE)
            res.json(label)
          })
        }

        Label.isUnoccupiedName(name)
          .then(doUpdate)
          .catch(label => {
            if (label.isId(req.params.labelId))
              doUpdate()
            else
              res.status(500).send(ERROR.OCCUPIED_LABEL_NAME)
          })

      })
    },
  },
  {
    method: HTTP.DELETE,
    path: '/label/:labelId',
    description: 'Remove a label',
    handler: (req, res) => {
      Label.remove({ _id: req.params.labelId }, (err, output) => {
        if (err)
          return res.status(500).json(ERROR.DATABASE_FAILURE)
        res.status(204).end()
      })
    },
  },
  {
    method: HTTP.DELETE,
    path: '/labels',
    description: 'Remove all labels (FOR DEBUG)',
    handler: (req, res) => {
      Label.remove({}, (err, output) => {
        if (err)
          return res.status(500).json(ERROR.DATABASE_FAILURE)
        res.status(204).end()
      })
    },
  },
]