import { Socket } from "socket.io-client";
import { AppStore } from ".";

export function subscribeUser(socket: Socket) {
  socket.emit('disable-recv-messages', (messages: string[]) => {
    AppStore.update((state) => {
      state.recvMessages = state.recvMessages.filter((type) => !messages.includes(type))
    });
  });

  socket.emit('disable-send-messages', (messages: string[]) => {
    AppStore.update((state) => {
      state.sendMessages = state.sendMessages.filter((type) => !messages.includes(type))
    });
  });

  socket.emit('disable-recv-tracks', (tracks: string[]) => {
    AppStore.update((state) => {
      state.recvTracks = state.recvTracks.filter((type) => !tracks.includes(type))
    });
  });

  socket.emit('disable-send-tracks', (tracks: string[]) => {
    AppStore.update((state) => {
      state.sendTracks = state.sendTracks.filter((type) => !tracks.includes(type))
    });
  });

  socket.emit('update-payload', (data: { displayName: string, avatar: string }) => {
    AppStore.update((state) => {
      state.displayName = data.displayName;
      state.avatar      = data.avatar;
    });
  });
}
