var server = require('http').Server()
var io = require('socket.io')(server)
var EventSource = require('eventsource')
const SECRET = process.env.SECRET
const SSE_URL = process.env.SSE_URL

io.use((socket, next) => {
	// Perform websocket authentication here
	next()    
}).on('connection', (socket) => {
	console.log("Connected")
})

var source = new EventSource(SSE_URL)
var prevId = ""
source.onmessage = async function (event) {
	var dat = JSON.parse(event.data)
	// Check most recent unique identifier 
	// to prevent repeated events in case of SSE timeout
	newId = dat[0].title
	if (newId != prevId){
		io.emit('data', dat)
		prevId = newId
	}
} 
server.listen(3000)
