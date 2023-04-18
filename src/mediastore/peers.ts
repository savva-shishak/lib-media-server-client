import { Socket } from "socket.io-client";
import { Peer } from "./types";
import { AppStore } from ".";

export function subscribePeersMove(socket: Socket) {
  socket.on('peer join', ({ peer }: { peer: Peer }) => {
    AppStore.update((state) => {    
      if (state.peerId === peer.peerId) {
        return;
      }

      state.peers.push(peer);
    });
  });

  socket.on('peer leave', ({ peerId }: { peerId: string }) => {
    AppStore.update((state) => {
      state.peers = state.peers.filter((peer) => peer.peerId !== peerId);
    });
  });
}