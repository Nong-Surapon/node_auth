const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const { logger } = require('./middleward/logEvents')
const errorHandle = require('./middleward/errorHandle')
const corsOptions = require('./config/corsOptions')
const PORT = process.env.PORT || 3500

// custom middleware logger
app.use(logger)

app.use(cors(corsOptions))

// build-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }))

// built-in middleware for json
app.use(express.json())

// server static files (css,image)
app.use('/', express.static(path.join(__dirname, '/public')))

// routes
app.use('/', require('./routes/root'))
app.use('/employees', require('./routes/api/employees'))

// Handle 404 not found
app.all('*', (req, res) => {
  res.status(404)
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'))
  } else if (req.accepts('json')) {
    res.json({ error: '404 Not Found' })
  } else {
    res.type('txt').send('404 Not Found')
  }
})

app.use(errorHandle)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
