'use strict'

const express        = require('express')
const router         = express.Router()


module.exports = (urlDataHelpers) => {

  // SHOW ALL URLS
  router.get('/', (req, res) => {
    urlDataHelpers.getURLs((err, urls) => {
      if (err) {
        return res.send('Error while connecting to the database.')
      }
      res.render('show_urls', {'urls': urls, 'currentUser': req.currentUser})
    })
  })

  // ADD A NEW URL
  router.post('/', (req, res) => {
    let newURL     = req.body.newURL
    newURL.user_id = req.currentUser.id
    newURL.cat_id  = Number(newURL.cat_id)
    newURL.overallRating  = Number(newURL.overallRating)
    urlDataHelpers.saveURL(newURL, (err, id) => {
      if (err) {
        return res.status(500).send('Error while connecting to the database.')
      }
      else {
        return res.status(201).send()
      }
    })
  })

  // SHOW ONE SPECIFIC URL
  router.get('/:id', (req, res) => {
    urlDataHelpers.getURL(req.params.id, (err, url) => {
      if (err) {
        return res.send('Error while connecting to the database.')
      }
      let loggedin = false
      if (req.currentUser) {loggedin = true}
      res.render('show_url',{'url': url[0], 'currentUser': req.currentUser})
    })
  }),

  // SEARCH IN THE DATABASE
  router.get('/search/:text', (req, res) => {
    urlDataHelpers.search(req.body.searchText, (err, urls) => {
      if(err) {
        return res.send('Error while connecting to the database.')
      }
      else {
        let loggedin = false
        if (req.currentUser.id) {loggedin = true}
        res.render("results", {'urls': urls, 'currentUser': req.currentUser})
      }
    })
  }),


  router.get('/:id/comments', (req, res) => {
    urlDataHelpers.getComments(req.params.id, (err, comments) => {
      if (err) {
        return res.status(500).send('Error while connecting to the database.')
      }
      return res.json(comments)
    })
  })




  return router
}
