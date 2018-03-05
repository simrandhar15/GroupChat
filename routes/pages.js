var express = require('express')
var router = express.Router()

var app = express()

var Message = require('../model/message')

//Import Node HTTP server
var http = require('http').Server(app)

//Import SocketIO
var io = require('socket.io')(http)




module.exports = router