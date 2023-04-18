import { Transport } from "mediasoup-client/lib/Transport";
import { ProducerInfo } from "../types";
import { Device } from "mediasoup-client";
import { Socket } from "socket.io-client";
import { request } from "../utils";

export async function createConsumer(
  producer: ProducerInfo,
  transport: Transport,
  device: Device,
  socket: Socket
) {
  const data = {
    producerId: producer.id,
    transportId: transport.id,
    rtpCapabilities: device.rtpCapabilities,
  };

  const params = await request(socket, 'create consumer', data);

  const consumer = await transport.consume({
    ...params,
    appData: {
      peerId: producer.peerId,
      mediaTag: producer.mediaTag,
    }
  });

  while (transport.connectionState !== 'connected') {
    await new Promise((r) => setTimeout(r, 100)); 
  }

  await request(socket, 'resume consumer', { consumerId: consumer.id });
  consumer.resume();

  consumer.appData.mediaTag = producer.mediaTag;
  consumer.appData.peerId = producer.peerId;

  return consumer;
}