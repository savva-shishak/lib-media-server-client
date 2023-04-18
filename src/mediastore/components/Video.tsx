import React, { useEffect, useRef } from "react";
import { useAllTracks } from "../hooks/tracks";

export type VideoProps = Omit<React.ComponentProps<'video'>, 'ref' | 'src'> & {
  peerId?: string,
  mediaTag: string,
  noVideo?: JSX.Element | string | JSX.Element[],
};

export function VideoProduce({ peerId, mediaTag, noVideo = <></>, ...props }: VideoProps): JSX.Element {
  const tracks = useAllTracks();
  const ref = useRef<HTMLVideoElement>();

  const trackData = tracks.find((data) => data.peerId === peerId && data.mediaTag === mediaTag);

  useEffect(() => {
    setTimeout(() => {
      if (!ref.current) {
        return;
      }
      ref.current.srcObject = (trackData && !trackData.paused && trackData.track) ? new MediaStream([trackData.track]) : null;
    }, 10);
  }, [trackData?.paused, trackData?.id]);

  if (!trackData || trackData.paused) {
    return noVideo as JSX.Element
  }

  return <video {...props} autoPlay playsInline ref={ref as any} />
}