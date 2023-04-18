import React, { useEffect, useRef } from "react";
import { useAllTracks } from "../hooks/tracks";

export function AudioProduce({ peerId, mediaTag, ...props }: { peerId?: string, mediaTag: string } & Omit<React.ComponentProps<'audio'>, 'ref' | 'src'>) {
  const tracks = useAllTracks();
  const ref = useRef<HTMLAudioElement>();

  const trackData = tracks.find((data) => data.peerId === peerId && data.mediaTag === mediaTag);

  useEffect(() => {
    setTimeout(() => {
      if (!ref.current) {
        return;
      }
      ref.current.srcObject = (trackData && !trackData.paused && trackData.track) ? new MediaStream([trackData.track]) : null;
    }, 10);
  }, [trackData?.paused, trackData?.id]);

  return <audio {...props} autoPlay playsInline ref={ref as any} />
}