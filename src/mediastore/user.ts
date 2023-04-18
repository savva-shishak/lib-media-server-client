import { Socket } from "socket.io-client";
import { AppStore } from ".";
import { closeTrack } from "./media/userMedia";
import { closeConsumer } from "./media/peersProducers";

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
      state.recvTracks = state.recvTracks.filter((type) => !tracks.includes(type));
    });

    const consumers = AppStore.getRawState().consumers.filter((c) => tracks.includes(c.appData.mediaTag as any));

    consumers.forEach((consumer) => closeConsumer(consumer));
  });

  socket.emit('disable-send-tracks', (tracks: string[]) => {
    AppStore.update((state) => {
      state.sendTracks = state.sendTracks.filter((type) => !tracks.includes(type));

      tracks.forEach((mediaTag) => closeTrack(mediaTag));
    });
  });

  socket.emit('update-payload', (data: { displayName: string, avatar: string }) => {
    AppStore.update((state) => {
      state.displayName = data.displayName;
      state.avatar      = data.avatar;
    });
  });
}
