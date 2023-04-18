import { Device } from "mediasoup-client";
import { Socket } from "socket.io-client";

export async function createSendTransport(device: Device, socket: Socket) {
  const options = await new Promise<any>(res => socket.emit('create transport', null, (data: any) => res(data)));
  const transport = device.createSendTransport(options);

  transport.on('connect', async ({ dtlsParameters }, callback, errback) => {
    try {
      socket.emit(
        'connect transport',
        { transportId: transport.id, dtlsParameters },
        () => callback()
      );
    } catch (error: any) {
      errback(error);
    }
  });

  transport.on(
    'produce',
    async ({ kind, rtpParameters, appData }, callback, errback) => {
      try {        
        socket.emit(
          'create producer',
          {
            transportId: transport.id,
            kind,
            rtpParameters,
            mediaTag: appData.mediaTag,
            paused: appData.paused,
          },
          callback
        );
      } catch (error: any) {
        errback(error);
      }
    },
  );

  return transport;
}


export async function createRecvTransport(device: Device, socket: Socket) {
  const options = await new Promise<any>(res => socket.emit('create transport', null, (data: any) => res(data)));
  const transport = device.createRecvTransport(options);

  transport.on('connect', async ({ dtlsParameters }, callback, errback) => {
    try {
      socket.emit(
        'connect transport',
        { transportId: transport.id, dtlsParameters },
        () => callback()
      );
    } catch (error: any) {
      errback(error);
    }
  });

  return transport;
}