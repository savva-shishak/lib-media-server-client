# Библиотека для работы с медиа сервером

Библиотека предоставляет pullstate хранилище
```typescript

// mediastore/index.ts

export const AppStore = new Store<{
  peerId: string,                 // Идентификатор текущей сессии (пользователя)
  connectStatus: string,          // Текстовое описание статуса подключения
  errorConnection: null | string, // Текстовое описание ошибки
  displayName: string,            // Имя текущего пользователя
  avatar: null | string,          // Аватар текущего пользователя
  sendTracks: string[],           // Под какими тега пользователь может отправлять трансляции
  sendMessages: string[],         // Какие типы сообщений может отправлять пользователь 
  recvTracks: string[],           // Под какими тега пользователь может получать трансляции
  recvMessages: string[],         // Какие типы сообщений может получать пользователь
  peers: [] as Peer[],            // Другие пользователи
}>()
```
На самом деле полей больше, но для работы создаваемого приложения достаточно этих

Пока вы не подключены к медиа северу хранилище имеет пустые значения или значения по умолчанию

Для подключения к серверу необходимо получить токен для подключения от медиа сервера и вызвать функцию connectToServer
```ts

// mediastore/connectToServer.ts

type OnMessage = (msg: { type: string, body: any }) => void;

function connectToServer(
  token: string, // Токен для подключения
  onMessage: OnMessage, // Функция для обработки сообщений
);
```

В случае ошибки, текстовое описание ошибки будет будет так же храниться в указанном выше хранилище

Во время выполмения данной функции статус подключения в хранилище будет меняться а после выполнения (Promise.then(), await) в хранилище постоянно будут актуальные для данной сессии данные.

Само транслирование происходит с помощью нативных в браузеро

После успешного подключения Вам станут доступны следующие функции:

```ts
// mediastore/media/userMedia.ts

// Отправить трек
export function sendTrack(
  track: MediaStreamTrack,
  mediaTag: string,
  paused: boolean = false
);

// Возобновить трек
export function resumeTrack(mediaTag: string);

// Поставить трек на паузу
export function pauseTrack(mediaTag: string);

// Закрыть трек
export function closeTrack(mediaTag: string);

// mediastore/index.ts

// Откправить сообщение
export function sendMessage(
  msg: {
    type: string, // Тип сообщения
    body: any     // Тело сообщения
  }
);

// Закончить разговор
export function closeCall();
```
