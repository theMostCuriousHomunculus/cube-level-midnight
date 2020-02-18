const express = require('express')
const User = require('../models/user-model')
const { Cube } = require('../models/cube-model')
const authentication = require('../middleware/authentication')
const asyncForEach = require('../utils/async-forEach')
const router = new express.Router()

// see if a username is available
router.post('/users/registration-validation', async (req, res) => {
  const nameTaken = await User.findOne({ account_name: req.body.account_name }).collation({ locale: 'en', strength: 2 })
  const emailAlreadyRegistered = await User.findOne({ email: req.body.email })

  if (nameTaken) {
    res.status(406).send('That username is already taken!  Try a different one.')
  } else if (emailAlreadyRegistered) {
    res.status(406).send('There is already an account registered to that email address!')
  } else {
    res.status(202).send()
  }
})

// New user registration
router.post('/users/register', async (req, res) => {
  const user = new User(req.body)

  try {
    await user.save()
    const token = await user.generateAuthToken()
    res.cookie('auth_token', token)
    res.status(201).redirect('/')
  } catch (error) {
    res.status(400).send(error)
  }
})

// Existing user login
router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.cookie('auth_token', token)
    res.redirect('/')
  } catch (error) {
    res.status(400).json({
      error: error.message
    })
  }
})

// View profile
router.get('/users/my-profile', authentication, async (req, res) => {
  res.render('my-profile', {
    account_name: req.user.account_name,
    avatar: req.user.avatar,
    email: req.user.email,
    title: 'My Profile',
    js: ['my-profile.js']
  })
})

// Logout of single session
router.post('/users/logout', authentication, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.cookies['auth_token']
    })
    await req.user.save()

    res.redirect('/welcome')
  } catch (e) {
    res.status(500).send()
  }
})

// Logout of all sessions
router.post('/users/logout-all', authentication, async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()

    res.redirect('/welcome')
  } catch (e) {
    res.status(500).send()
  }
})

// change the user's avatar
router.post('/users/change-avatar', authentication, async (req, res) => {
  req.user.avatar = req.body.image
  await req.user.save()
  res.redirect('/users/my-profile')
})

// check account name availability
router.post('/users/check-account-name-availability', authentication, async (req, res) => {
  const nameTaken = await User.findOne({ account_name: req.body.account_name }).collation({ locale: 'en', strength: 2 })

  if (nameTaken) {
    res.status(406).send({ error: 'That username is already taken!  Try a different one.', account_name: req.user.account_name })
  } else {
    res.status(202).send({})
  }
})

// change the user's account name
router.post('/users/change-account-name', authentication, async (req, res) => {
  req.user.account_name = req.body.account_name
  await req.user.save()
  res.redirect('/users/my-profile')
})

// view all the users you have a relationship with
router.get('/users/my-buds', authentication, async (req, res) => {
  const { buds, sent_bud_requests, received_bud_requests, blocked_users } = req.user

    // these for each functions will ensure the users' account names, rather than their user IDs, will be displayed
  await asyncForEach(buds, async (bud) => {
    var user = await User.findById(bud._id)
    var cubes = await Cube.findByCreator(bud._id)
    bud.account_name = user.account_name
    bud.avatar = user.avatar
    bud.cubes = cubes
  })

  await asyncForEach(sent_bud_requests, async (pendingBud) => {
    var user = await User.findById(pendingBud._id)
    pendingBud.account_name = user.account_name
    pendingBud.avatar = user.avatar
  })

  await asyncForEach(received_bud_requests, async (aspiringBud) => {
    var user = await User.findById(aspiringBud._id)
    aspiringBud.account_name = user.account_name
    aspiringBud.avatar = user.avatar
  })

  await asyncForEach(blocked_users, async (dick) => {
    var user = await User.findById(dick._id)
    dick.account_name = user.account_name
    dick.avatar = user.avatar
  })

  res.render('my-buds', {
    account_name: req.user.account_name,
    buds: buds.sort(function (a, b) {
      var nameA = a.account_name.toUpperCase()
      var nameB = b.account_name.toUpperCase()
      if (nameA < nameB) {
        return -1
      }
      if (nameA > nameB) {
        return 1
      }
      return 0
    }),
    pending_buds: sent_bud_requests.sort(function (a, b) {
      var nameA = a.account_name.toUpperCase()
      var nameB = b.account_name.toUpperCase()
      if (nameA < nameB) {
        return -1
      }
      if (nameA > nameB) {
        return 1
      }
      return 0
    }),
    aspiring_buds: received_bud_requests.sort(function (a, b) {
      var nameA = a.account_name.toUpperCase()
      var nameB = b.account_name.toUpperCase()
      if (nameA < nameB) {
        return -1
      }
      if (nameA > nameB) {
        return 1
      }
      return 0
    }),
    dicks: blocked_users.sort(function (a, b) {
      var nameA = a.account_name.toUpperCase()
      var nameB = b.account_name.toUpperCase()
      if (nameA < nameB) {
        return -1
      }
      if (nameA > nameB) {
        return 1
      }
      return 0
    }),
    title: 'My Buds'
  })
})

// search for a user to block or send a bud request to
router.get('/users/search-users', authentication, async (req, res) => {
  const matchingUsers = await User.find({ $text: { $search: req.query.account_name }, 'blocked_users._id': { $ne: req.user._id } }, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } })

  matchingUsers.forEach(function (match) {
    if (match.buds.includes(`{ _id: ${req.user._id} }`)) {
      match.isBud = true
    }
    if (match.sent_bud_requests.includes(`{ _id: ${req.user._id} }`)) {
      match.isAspiringBud = true
    }
    if (match.received_bud_requests.includes(`{ _id: ${req.user._id} }`)) {
      match.isPendingBud = true
    }
  })

  res.render('user-search-results', {
    matching_users: matchingUsers,
    title: 'User Search Results'
  })
})

// block a user who has not tried to friend request you
router.post('/users/block-user', authentication, async (req, res) => {

})

// send another user a bud request
router.post('/users/send-bud-request', authentication, async (req, res) => {
  const potentialBud = await User.findById(req.body.potential_bud_id)
  req.user.sent_bud_requests.push(req.body.potential_bud_id)
  await req.user.save()
  potentialBud.received_bud_requests.push(req.user._id)
  await potentialBud.save()

  res.redirect('/users/my-buds')
})

// respond to a bud request someone sent you
router.post('/users/respond-bud-request', authentication, async (req, res) => {
  const aspiringBud = await User.findById(req.body.aspiring_bud_id)
  req.user.received_bud_requests.pull(req.user.received_bud_requests.id(req.body.aspiring_bud_id))
  aspiringBud.sent_bud_requests.pull(aspiringBud.sent_bud_requests.id(req.user._id))

  if (req.body.response == 'accept') {
    req.user.buds.push(req.body.aspiring_bud_id)
    aspiringBud.buds.push(req.user._id)
  } else if (req.body.response = 'block') {
    req.user.blocked_users.push(req.body.aspiring_bud_id)
  } else {

  }

  await req.user.save()
  await aspiringBud.save()

  res.redirect('/users/my-buds')
})

// remove a user from one's dick list
router.post('/users/undick', authentication, async (req, res) => {
  req.user.blocked_users.pull(req.body.dick_id)

  await req.user.save()
  res.redirect('/users/my-buds')
})

module.exports = router
