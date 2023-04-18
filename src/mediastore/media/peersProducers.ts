import { Device } from "mediasoup-client";
import { Transport } from "mediasoup-client/lib/Transport";
import { Socket } from "socket.io-client";
import { ProducerInfo } from "../types";
import { AppStore } from "..";
import { createConsumer } from "./createConsumer";

export function subscribePeersProducers(
  transport: Transport,
  socket: Socket,
  device: Device,
  producers: ProducerInfo[],
) {
  socket.on('create producer', async (producer: ProducerInfo) => {
    const consumer = await createConsumer(producer, transport, device, socket);

    AppStore.update((state) => {
      if (producer.paused) {
        state.pausedConsumers.push(consumer.id);
      }
      state.consumers.push(consumer);
    });
  });

  socket.on('pause producer', ({ id }) => {
    AppStore.update((state) => {
      state.pausedConsumers.push(id);
    });
  });

  socket.on('resume producer', ({ id }) => {
    AppStore.update((state) => {
      state.pausedConsumers = state.pausedConsumers.filter((i) => i !== id);
    });
  });

  socket.on('close producer', ({ id }) => {
    AppStore.update((state) => {
      const consumer = state.consumers.find((consumer) => consumer.producerId === id);

      if (consumer) {
        consumer.close();
        state.pausedProducers = state.pausedProducers.filter((i) => i !== id);
        state.consumers = state.consumers.filter((consumer) => consumer.producerId !== id);
      }
    });
  });

  return Promise
    .all(producers.map((p) => createConsumer(p, transport, device, socket)))
    .then((consumers) => {
      AppStore.update((state) => {
        state.pausedProducers = producers.filter((p) => p.paused).map((p) => p.id)
        state.consumers = consumers;
      });
    });
}