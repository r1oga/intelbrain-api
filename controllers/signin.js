const jwt = require('jsonwebtoken')

const handleSignin = (db, bcrypt, req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return Promise.reject('incorrect form submission')
  }

  return db
    .select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash)
      if (isValid) {
        return db
          .select('*')
          .from('users')
          .where('email', '=', email)
          .then(user => user[0])
          .catch(err => Promise.reject('Unable to get user'))
      } else {
        Promise.reject('Wrong password')
      }
    })
    .catch(err => Promise.reject('Unable to find account with this email'))
}

const getAuthTokenId = () => {
  console.log('auth ok')
}

const signToken = email =>
  jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '2 days' })

const createSession = ({ email, id }) => {
  // create JWT token
  const token = signToken(email)
  return { success: true, id, token }
}

const authenticate = (db, bcrypt) => (req, res) => {
  const { authorization } = req.headers

  return authorization
    ? getAuthTokenId()
    : handleSignin(db, brypt, req, res)
        .then(data =>
          data.id && data.email ? createSession(data) : Promise.reject(data)
        )
        .then(session => res.json(session))
        .catch(err => res.status(400).json(err))
}

module.exports = {
  authenticate
}
