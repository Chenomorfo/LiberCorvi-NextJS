export default (io) => {
  io.on("connection", (socket) => {
    socket.on("client:update service", (service) => {
      //Aqui va todo
      socket.broadcast.emit("server:update service", service);
    });
  });
};
