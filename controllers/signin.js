const jwt = require('jsonwebtoken')
const redisClient = require('redis').createClient({
  host: process.env.REDIS_URI
})

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

const signToken = email =>
  jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '2 days' })

const setKey = (key, value) => Promise.resolve(redisClient.set(key, value))

const getAuthTokenId = (req, res) => {
  const { authorization } = req.headers
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(400).json('Unauthorized')
    }
    return res.json({ id: reply })
  })
}

const createSession = ({ email, id }) => {
  // create JWT token
  const token = signToken(email)
  return setKey(token, id)
    .then(() => ({ success: true, id, token }))
    .catch(console.log)
}

const authenticate = (db, bcrypt) => (req, res) => {
  const { authorization } = req.headers

  return authorization
    ? getAuthTokenId(req, res)
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
