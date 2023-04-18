import { useState } from 'react';
import './App.css'
import { closeCall } from './mediastore';
import { connectToServer } from './mediastore/connectToServer';
import { sendTrack } from './mediastore/media/userMedia';
import axios from 'axios';
import { Room } from './Room';

function App() {
  const [name, setName] = useState('User ' + (Math.random() * 100 >> 0));
  const [roomId, setRoomId] = useState('test');
  const [hidden, setHidden] = useState(false);

  return (
    <div>
      <div className="Header">
        <input
          value={roomId}
          placeholder="Ваше имя"
          onChange={(e) => setRoomId(e.target.value)}
          style={{ width: '280px' }}
        />
        <input
          value={name}
          placeholder="Идентификатор комнаты"
          onChange={(e) => setName(e.target.value)}
          style={{ width: '280px' }}
        />
        <label>
          <input checked={hidden} onClick={() => setHidden(!hidden)} type="checkbox" /> режим невидимки
        </label>
        <button
          onClick={async () => {
            closeCall();
            
            const { data: { token } } = await axios.post(
              'http://192.168.4.156:3003/create-peer',
              {
                displayName: name,
                avatar: null,
                sendTracks: ["cam-video", "cam-audio"],
                sendMessages: [],
                recvTracks: ["cam-video", "cam-audio"],
                recvMessages: [],
                roomId,
                hidden
              },
              {
                headers: {
                  'serverid': 'server-123',
                  'serverpassword': '123',
                }
              }
            )

            await connectToServer(token, (message) => console.log(message));

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });

            sendTrack(stream.getVideoTracks()[0], 'cam-video');
            // sendTrack(stream.getAudioTracks()[0], 'cam-audio');
          }}
        >
          Подключиться
        </button>
      </div>
      <Room />
    </div>
  )
}

export default App
