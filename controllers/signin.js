const jwt = require('jsonwebtoken')
const redisClient = require('redis').createClient(process.env.REDIS_URL)

const signToken = email => {
  if (process.env.JWT_SECRET) {
    return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '2 days' })
  } else {
    return false
  }
}

const setRedisKey = (key, value) => Promise.resolve(redisClient.set(key, value))

const createSession = ({ email, id }) => {
  // create JWT token
  const token = signToken(email)
  if (token) {
    return setRedisKey(token, id)
      .then(() => ({ success: true, id, token }))
      .catch(err => 'Could not set key')
  } else {
    return Promise.reject(
      'Failed to create session. Is JWT_SECRET environment variable defined?'
    )
  }
}

const getAuthTokenId = (req, res) => {
  const { authorization } = req.headers
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(401).json('Unauthorized')
    }
    return res.json({ id: reply })
  })
}

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
          .catch(err => 'Unable to get user')
      } else {
        return Promise.reject('Wrong password')
      }
    })
    .catch(err => 'Email not found')
}

const authenticate = (db, bcrypt) => (req, res) => {
  const { authorization } = req.headers
  return authorization
    ? getAuthTokenId(req, res)
    : handleSignin(db, bcrypt, req, res)
        .then(data =>
          data.id && data.email ? createSession(data) : Promise.reject(data)
        )
        .then(session => res.json(session))
        .catch(err => res.status(400).json(err))
}

module.exports = {
  authenticate,
  redisClient
}
