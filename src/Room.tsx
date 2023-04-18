import { AppStore } from "./mediastore";
import { AudioProduce } from "./mediastore/components/Audio";
import { VideoProduce } from "./mediastore/components/Video";
import { useAllTracks } from "./mediastore/hooks/tracks";

export function Room() {
  const status = AppStore.useState((s) => s.connectStatus);
  const error = AppStore.useState((s) => s.errorConnection);
  const displayName = AppStore.useState((s) => s.displayName);

  const peers = AppStore.useState((s) => s.peers);
  const tracks = useAllTracks();

  return (
    <div className="body">
      <div className="left">
        Статус: {status}
        <br />
        Ошибка: {error || 'Нет'}
        <div className="self-video">
          <VideoProduce mediaTag="cam-video" />
        </div>
        Ваше имя: {displayName}
        <br />
        Пользователей: {peers.length}
        <ul>
          {peers.map((peer) => <li key={peer.peerId}>{peer.displayName}</li>)}
        </ul>
        Трансляции: {tracks.length}
        <ul>
          {tracks.map((track) => (
            <li key={track.id}>
              {track.mediaTag as string}
              {' '}
              -
              {' '}
              {peers.find((peer) => peer.peerId === track.peerId)?.displayName || 'Ваша'}
            </li>
          ))}
        </ul>
      </div>
      <div className="grid">
        {peers.map((peer) => (
          <div>
            <AudioProduce peerId={peer.peerId} mediaTag="cam-audio" />
            <VideoProduce peerId={peer.peerId} mediaTag="cam-video" />
          </div>
        ))}
      </div>
    </div>
  );
}