/* External Dependencies*/
import keyMirror from 'keymirror'
import moment from 'moment'

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
  NONEXISTENT_MEMO: '메모가 존재하지 않습니다.',
  NONEXISTENT_LABEL: '라벨이 존재하지 않습니다.',
  OCCUPIED_LABEL_NAME: '해당 라벨 이름이 이미 존재합니다. 라벨 이름은 겹칠 수 없습니다.',
}
Object.keys(ERROR).forEach(error => {
  ERROR[error] = { errorMessage: ERROR[error] }
})

const getNow = () => +moment().format('x')

export default [

  //  label

  {
    method: HTTP.GET,
    path: '/labels',
    description: 'List all labels',
    handler: (req, res) => {
      Label.find({}, {}, (err, labels) => {
        if (err) {
          res.status(500).send(ERROR.DATABASE_FAILURE)
        } else {
          res.json(labels)
        }
      })
    },
  },
  {
    method: HTTP.GET,
    path: '/label/:labelId',
    description: 'Get a label (FOR DEBUG)',
    handler: (req, res) => {
      Label.findById(req.params.labelId, {}, (err, label) => {
        if (err) {
          res.status(500).send(ERROR.DATABASE_FAILURE)
        } else {
          res.json(label)
        }
      })
    },
  },
  {
    method: HTTP.POST,
    path: '/label',
    description: 'Create a label',
    handler: (req, res) => {
      const { name = '' } = req.body
      Label.isUnoccupiedName(name)
        .then(() => {
          const newLabel = new Label({ name, createdAt: getNow() })

          newLabel.save((err, label) => {
            if (err) {
              res.status(500).json(ERROR.DATABASE_FAILURE)
            } else {
              res.json(label)
            }
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
        if (err) {
          res.status(500).json(ERROR.DATABASE_FAILURE)
        } else if (!label) {
          res.status(404).json(ERROR.NONEXISTENT_LABEL)
        } else {
          const { name = '' } = req.body

          const doUpdate = () => {
            if (name) {
              label.name = name
            }

            label.save(err2 => {
              if (err2) {
                res.status(500).json(ERROR.DATABASE_FAILURE)
              } else {
                res.json(label)
              }
            })
          }

          Label.isUnoccupiedName(name)
            .then(doUpdate)
            .catch(occupyingLabel => {
              if (occupyingLabel.isId(req.params.labelId)) {
                doUpdate()
              } else {
                res.status(500).send(ERROR.OCCUPIED_LABEL_NAME)
              }
            })
        }
      })
    },
  },
  {
    method: HTTP.DELETE,
    path: '/label/:labelId',
    description: 'Remove a label',
    handler: (req, res) => {
      Label.remove({ _id: req.params.labelId }, err => {
        if (err) {
          res.status(500).json(ERROR.DATABASE_FAILURE)
        } else {
          res.status(204).end()
        }
      })
    },
  },
  {
    method: HTTP.DELETE,
    path: '/labels',
    description: 'Remove all labels (FOR DEBUG)',
    handler: (req, res) => {
      Label.remove({}, err => {
        if (err) {
          res.status(500).json(ERROR.DATABASE_FAILURE)
        } else {
          res.status(204).end()
        }
      })
    },
  },

  //  memo

  {
    method: HTTP.GET,
    path: '/memos',
    description: 'List all memos',
    handler: (req, res) => {
      Memo.find({}, {}, (err, memos) => {
        if (err) {
          res.status(500).send(ERROR.DATABASE_FAILURE)
        } else {
          res.json(memos)
        }
      })
    },
  },
  {
    method: HTTP.POST,
    path: '/memo',
    description: 'Create a Memo',
    handler: (req, res) => {
      const { title = '', content = '', labelIds = [] } = req.body
      const newMemo = new Memo({ title, content, labelIds, updatedAt: getNow() })

      newMemo.save((err, memo) => {
        if (err) {
          res.status(500).json(ERROR.DATABASE_FAILURE)
        } else {
          res.json(memo)
        }
      })
    },
  },
  {
    method: HTTP.PUT,
    path: '/memo/:memoId',
    description: 'Update a memo',
    handler: (req, res) => {
      Memo.findById(req.params.memoId, (err, memo) => {
        if (err) {
          res.status(500).json(ERROR.DATABASE_FAILURE)
        } else if (!memo) {
          res.status(404).json(ERROR.NONEXISTENT_MEMO)
        } else {
          const { title, content, labelIds } = req.body

          if (title) {
            memo.title = title
          }
          if (content) {
            memo.content = content
          }
          if (labelIds) {
            memo.labelIds = labelIds
          }
          memo.updatedAt = getNow()

          memo.save(err2 => {
            if (err2) {
              res.status(500).json(ERROR.DATABASE_FAILURE)
            } else {
              res.json(memo)
            }
          })
        }
      })
    },
  },
  {
    method: HTTP.DELETE,
    path: '/memo/:memoId',
    description: 'Delete a memo',
    handler: (req, res) => {
      Memo.remove({ _id: req.params.memoId }, err => {
        if (err) {
          res.status(500).json(ERROR.DATABASE_FAILURE)
        } else {
          res.status(204).end()
        }
      })
    },
  },
  {
    method: HTTP.DELETE,
    path: '/memos',
    description: 'Remove all memos (FOR DEBUG)',
    handler: (req, res) => {
      Memo.remove({}, err => {
        if (err) {
          res.status(500).json(ERROR.DATABASE_FAILURE)
        } else {
          res.status(204).end()
        }
      })
    },
  },
]