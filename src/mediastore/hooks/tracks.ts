import { AppStore } from "..";

export function useAllTracks() {
  const producers = AppStore.useState((s) => s.producers);
  const pausedProducers = AppStore.useState((s) => s.pausedProducers);
  const consumers = AppStore.useState((s) => s.consumers);
  const pausedConsumers = AppStore.useState((s) => s.pausedConsumers);

  return [
    ...producers.map((producer) => ({
      id: producer.id,
      peerId: producer.appData.peerId as string,
      kind: producer.kind,
      mediaTag: producer.appData.mediaTag as string,
      track: producer.track,
      paused: pausedProducers.some((id) => id === producer.id),
    })),
    ...consumers.map((consumer) => ({
      id: consumer.id,
      peerId: consumer.appData.peerId,
      kind: consumer.kind,
      mediaTag: consumer.appData.mediaTag,
      track: consumer.track as MediaStreamTrack | null,
      paused: pausedConsumers.some((id) => id === consumer.producerId),
    })),
  ];
}
