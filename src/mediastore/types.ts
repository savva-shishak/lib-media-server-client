import { RtpCapabilities } from "mediasoup-client/lib/RtpParameters"

export type LoadedRoomData = {
  roomId: string,
  peers: Peer[],
  producers: ProducerInfo[],
  routerRtpCapabilities: RtpCapabilities,
}

export type Peer = {
  peerId: string,
  displayName: string,
  avatar: string | null,
}

export type ProducerInfo = {
  id: string,
  peerId: string,
  kind: 'video' | 'audio',
  mediaTag: string,
  paused: boolean,
  recordStatus: 'stop' | 'setting' | 'run',
}