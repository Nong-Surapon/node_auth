const usersDB = {
  users: require('../model/users.json'),
  setUsers: function (data) {
    this.users = data
  },
}
const jwt = require('jsonwebtoken')
require('dotenv').config()

const handleRefreshToken = (req, res) => {
  // Cookies that have not been signed
  console.log('Cookies: ', req.cookies)

  // Cookies that have been signed
  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(401)
  const refreshToken = cookies.jwt

  const foundUser = usersDB.users.find(
    (person) => person.refreshToken === refreshToken,
  )
  if (!foundUser) return res.sendStatus(403) //Forbidden
  // evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username) {
      return res.sendStatus(403)
    }

    const roles = Object.values(foundUser.roles)
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '30s' },
    )

    res.json({ accessToken })
  })
}

module.exports = { handleRefreshToken }

// ใช้กับ ดูเพิ่มเติม client https://www.youtube.com/watch?v=s-4k5TcGKHg&list=PL0Zuz27SZ-6PFkIxaJ6Xx_X46avTM1aYw&index=17
