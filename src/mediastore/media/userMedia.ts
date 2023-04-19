import { Transport } from "mediasoup-client/lib/Transport";
import { Socket } from "socket.io-client";
import { AppStore } from "..";

let transport: Transport;
let socket: Socket;

export function connectUserMedia(t: Transport, s: Socket) {
  transport = t;
  socket = s;
}

function findProducer(mediaTag: string) {
  return AppStore.getRawState().producers.find(producer => producer.appData.mediaTag === mediaTag);
}

export async function sendTrack(track: MediaStreamTrack, mediaTag: string, paused = false) {
  try {
    const producer = await transport.produce({
      track,
      appData: {
        mediaTag,
        paused,
      },
    });

    AppStore.update((state) => {
      if (paused) {
        producer.pause();
        state.pausedProducers.push(producer.id);
      }

      state.producers.push(producer);
    });
  } catch (e: any) {}
}

export function resumeTrack(mediaTag: string) {
  const producer = findProducer(mediaTag);

  if (producer) {
    producer.resume();
    socket.emit('resume producer', { producerId: producer.id });
    AppStore.update((state) => {
      state.pausedProducers = state.pausedProducers.filter((i) => i !== producer.id);
    });
  }
}

export function pauseTrack(mediaTag: string) {
  const producer = findProducer(mediaTag);

  if (producer) {
    producer.resume();
    socket.emit('pause producer', { producerId: producer.id });
    AppStore.update((state) => {
      state.pausedProducers.push(producer.id);
    });
  }
}

export function closeTrack(mediaTag: string) {
  const producer = findProducer(mediaTag);

  if (producer) {
    socket.emit('close producer', { producerId: producer.id });
    AppStore.update((state) => {
      state.producers = state.producers.filter((p) => p.id !== producer.id);
      state.pausedProducers = state.pausedProducers.filter((i) => i !== producer.id);
    });
    return producer.close();
  }
}
