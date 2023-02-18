const roomSignalingDataHandler = (socket, data) => {
  const { conUserSocketId, signal } = data;

  const signalData = { signal, conUserSocketId: socket.id };
  socket.to(conUserSocketId).emit("conn-signal", signalData);
};

module.exports = roomSignalingDataHandler;
