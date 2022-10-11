# Zoom clone coding

### Good to know

initialize npm. set up dev environment from here.
`npm init -y`

install nodemon. It will restart server if there are any changes.

`npm i nodemon -D`

install babel. babel is a complier for javascript.

`npm i @babel/core @babel/cli @babel/node @babel/preset -D`

install express. Framework for nodejs.

`npm i express`

install pug. It is a template engine for nodejs.

`npm i pug`

### Protocol

use for chat, notification and real-time stuff.

HTTP and Websocket are both communication protocols.

- HTTP: User send request -> Server response(forget user here) -> User send request ...
  - HTTP is stateless. back-end cannot remember the user. this is not real-time ops.
- Websocket: User send request -> Server accept -> This connection will establish until connection closed.
  - Websocket is bi-directional.

express only handle HTTP stuff. need to integrate express with Websocket.

to use websocket.

`npm i ws`

### SocketIO

SocketIO is not implementing websocket. it is a independent framework for websocket.

if there is no websocket. it will use other way(HTTP long-polling).

auto reconnect.

To install, `npm i socket.io`
