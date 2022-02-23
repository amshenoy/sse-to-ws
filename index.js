const crypto = require('crypto')
var app = require('express')()
var server = require('http').Server(app)
var io = require('socket.io')(server)
var EventSource = require('eventsource')
const SECRET = process.env.SECRET
const SSE_URL = process.env.SSE_URL

io.use((socket, next) => {
  if (socket.handshake.auth && socket.handshake.auth.token){
  	var details = socket.handshake.auth.token.split(':')
  	var userAuth = crypto.createHmac('sha1', SECRET).update(details[0]).digest('hex')
    if (details[1] == userAuth){
  		socket.username = details[0];
  		next()
  	}else{
  		const err = new Error("Authentication error")
  		err.data = { content: "Please retry later" }
  		next(err)
  	}
  } else {
  	const err = new Error("Unauthorised access")
  	err.data = { content: "Please retry later" }
  	next(err)
  }    
}).on('connection', (socket) => {
	console.log(socket.username + " connected")
})

var source = new EventSource(SSE_URL)
var prevhead = ""
source.onmessage = async function (event) {
  var dat = JSON.parse(event.data)
  if (dat[0].title != prevhead){
	  //console.log(dat[0].title + " " + dat[0].updated)
	  io.emit('data', dat)
	  prevhead = dat[0].title
  }
} 

server.listen(3000)