const serverStore = require("../serverStore");
const roomLeaveHandler = require("./roomLeaveHandler");

const disconnectHandler = (socket) => {
  const activeRooms = serverStore.getActiveRooms();
  activeRooms.forEach((ar) => {
    const userInRoom = ar.participants.some((p) => p.socketId === socket.id);
    if (userInRoom) {
      roomLeaveHandler(socket, { roomId: ar.roomId });
    }
  });
  serverStore.removeConnectedUser(socket.id);
};

module.exports = disconnectHandler;
