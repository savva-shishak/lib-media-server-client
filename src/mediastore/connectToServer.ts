import { io } from "socket.io-client";
import { AppStore, Status, state } from ".";
import { LoadedRoomData } from "./types";
import { connectMedia } from "./media";
import { subscribePeersMove } from "./peers";
import { subscribeUser } from "./user";

export function connectToServer(
  jwt: string, 
  onClientMessage: (msg: { type: string, body: any }) => void
) {
  return new Promise<void>((res) => {
    const url = new URL((import.meta as any).env.VITE_SERVER_URL);

    AppStore.update((state) => {
      state.connectStatus = Status.SettingsConnect;
    });
  
    const socket = io(
      url.origin,
      { 
        path: (url.pathname.length > 1 ? url.pathname : '') + '/socket.io',
        query: { jwt },
      },
    );

    socket.on('client-message', onClientMessage);
  
    socket.on('disconnect', () => {
      AppStore.update((state) => {
        state.connectStatus = Status.SettingsConnect;
      });
    });
  
    socket.on('auth-error', (msg) => {
      AppStore.update((state) => {
        state.connectStatus = Status.SettingsConnect;
        state.errorConnection = msg;
      });
    });
  
    socket.on('identify-user', (data) => {
      AppStore.update((state) => {
        state.peerId              = data.peerId;
        state.displayName         = data.displayName;
        state.avatar              = data.avatar;
        state.sendMessages        = data.sendMessages;
        state.recvMessages        = data.recvMessages;
        state.sendTracks          = data.sendTracks;
        state.recvTracks          = data.recvTracks;
        state.hidden              = data.hidden;
      });
    });
  
    socket.on('joined', async ({ room }: { room: LoadedRoomData }) => {
      await connectMedia(room.routerRtpCapabilities, socket, room.producers);

      AppStore.update((state) => {
        state.peers = room.peers.filter((peer) => peer.peerId !== state.peerId);
      });

      subscribePeersMove(socket);
      subscribeUser(socket);
      res();
    });

    state.socket = socket;
  });
}