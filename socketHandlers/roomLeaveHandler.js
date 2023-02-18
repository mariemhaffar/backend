const serverStore = require("../serverStore");
const roomsUpdates = require("./updates/rooms");

const roomLeaveHandler = (socket, data) => {
  const { roomId } = data;
  const activeRoom = serverStore.getActiveRoom(roomId);

  if (activeRoom) {
    serverStore.leaveActiveRoom(roomId, socket.id);

    const updatedActiveRoom = serverStore.getActiveRoom(roomId);
    if (updatedActiveRoom) {
      updatedActiveRoom.participants.forEach((p) => {
        socket.to(p).emit("room-participant-left", {
          connUserSocketId: socket.id,
        });
      });
    }
    roomsUpdates.updateRooms();
  }
};

module.exports = roomLeaveHandler;
