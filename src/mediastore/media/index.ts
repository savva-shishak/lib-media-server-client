import { Device } from "mediasoup-client";
import { RtpCapabilities } from "mediasoup-client/lib/RtpParameters";
import { Socket } from "socket.io-client";
import { Status, setStatus } from "..";
import { createRecvTransport, createSendTransport } from "./createTransports";
import { subscribePeersProducers } from "./peersProducers";
import { ProducerInfo } from "../types";
import { connectUserMedia } from "./userMedia";

export async function connectMedia(
  routerRtpCapabilities: RtpCapabilities,
  socket: Socket,
  producers: ProducerInfo[]
) {
  const device = new Device();

  setStatus(Status.ConnectToMedia);

  await device.load({ routerRtpCapabilities });

  setStatus(Status.SettingMediaTransports);

  const [
    recv,
    send,
  ] = await Promise.all([
    createRecvTransport(device, socket),
    createSendTransport(device, socket),
  ]);

  setStatus(Status.GettingTracksOfPeers);

  await subscribePeersProducers(recv, socket, device, producers);

  connectUserMedia(send, socket);

  setStatus(Status.Ready);
}
