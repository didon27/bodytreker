const Sequelize = require('sequelize')
const passport = require('passport')
const FacebookTokenStrategy = require('passport-facebook-token')
const db = require('../models')
const User = db.user

passport.use(
  'facebookToken',
  new FacebookTokenStrategy(
    {
      clientID: '1218652091947754',
      clientSecret: '1b313fd68fceb71c399fbd27c8c8b878',
    },
    async (accessToken, refreshToken, profile, done, res) => {
      console.log('Inside facebook strategy')

      console.log(`Profile email : ${profile.emails[0].value}`)

      const existingUser = await User.findOne({
        where: {
          [Sequelize.Op.or]: [
            { email: { [Sequelize.Op.eq]: profile.emails[0].value } },
            { facebookid: { [Sequelize.Op.eq]: profile.id } },
          ],
        },
        attributes: ['id', 'email', 'facebookid'],
      })
      if (existingUser) {
        return done(null, existingUser)
      }

      const newuser = await User.create({
        email: profile.emails.value,
        facebookid: profile.id !== null ? profile.id : null,
      })

      if (typeof user !== 'undefined' && newuser !== null) {
        console.log('record inseted successfully')
        done(null, newuser)
      }
    }
  )
)
