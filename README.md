# SSE to WS
(Server-Sent Events to WebSocket)

## Initialise Server

1) Set SECRET - Used for generating and validating API keys
2) Set SSE_URL - Connects to Server-Sent Events page 



## Connect to WS
```js
const socket = io(serverUrl, {auth: {token: 'api-access-token'}, transports: ['websocket'], rejectUnauthorized: false});
socket.on('data', function(data) {
	document.querySelector('#data').innerHTML = JSON.stringify(data.map(x=>x.title));
});
```