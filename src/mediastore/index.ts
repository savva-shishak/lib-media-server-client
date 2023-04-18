import { Consumer } from "mediasoup-client/lib/Consumer";
import { Producer } from "mediasoup-client/lib/Producer";
import { Store } from "pullstate";
import { Peer } from "./types";
import { Socket } from "socket.io-client";

export enum Status {
  GettingReady = "Подгатавливаемся к работе с сервером",
  SettingsConnect = "Устанавливаем соединение с сервером",
  ConnectToMedia = "Подключаемся к медиа трансляции сервера",
  SettingMediaTransports = "Настраиваем медиа транспорты",
  GettingTracksOfPeers = "Получаем трансляции участников",
  Ready = "Подключено",
};

export type WindowFitMode = 'cover' | 'contain';
export type Theme = 'dark' | 'light';

function initValue() {
  return {
    peerId: '',
    connectStatus: Status.GettingReady,
    errorConnection: null as null | string,
    displayName: '',
    avatar: null as null | string,
    sendTracks: [],
    sendMessages: [],
    recvTracks: [],
    recvMessages: [],
    producers: [] as Producer[],
    pausedProducers: [] as string[],
    consumers: [] as Consumer[],
    pausedConsumers: [] as string[],
    peers: [] as Peer[],
    hidden: false,
  };
}

export const AppStore = new Store(initValue());

export function setStatus(status: Status) {
  AppStore.update((state) => {
    state.connectStatus = status;
  });
}

export const state = {
  socket: null as Socket | null,
};

export function closeCall() {
  if (state.socket) {
    state.socket.close();
    state.socket = null;
  }

  AppStore.update(initValue);
}

export function sendMessage(msg: { type: string, body: any }) {
  if (state.socket) {
    state.socket.emit('chat-message', msg);
  }
}
