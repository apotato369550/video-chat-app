const express = require('express')
const app = express()
const server = require("http").Server(app)
const io = require("socket.io")(server)
const { v4: uuidV4 } = require("uuid")

app.set("view engine", "ejs")
app.use(express.static("public"))

app.get("/", (req, res) => {
    res.redirect(`/${uuidV4()}`)
})

app.get("/:room", (req, res) => {
    res.render("room", { roomId: req.params.room })
})


// fix error here
// this don't work???
// revert changes??
io.on("connection", socket => {
    socket.on("join-room", (roomId, userId) => {
        console.log(roomId, userId)
        socket.join(roomId)
        // broadcast don't work
        socket.to(roomId).emit("user-connected", userId)

        socket.on("disconnect", () => {
            console.log('DISCONNECTING')
            socket.to(roomId).emit("user-disconnected", userId)
            // changing this yields problems^^^
        })
    })
})

server.listen(3000)