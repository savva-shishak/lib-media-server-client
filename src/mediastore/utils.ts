import { Socket } from "socket.io-client";

export function request<T = any>(socket: Socket, event: string, data: any) {
  return new Promise<T>((res) => socket.emit(event, data, res));
}