import React, { ReactNode, useEffect, useRef } from "react";
import { useAllTracks } from "../hooks/tracks";
import Konva from "konva";

export type MobileVideoProps = Omit<React.ComponentProps<'video'>, 'ref' | 'src' | 'style'> & {
  peerId?: string,
  mediaTag: string,
  noVideo?: ReactNode,
};

export function MobileVideo({ peerId, mediaTag, noVideo = <></>, ...props }: MobileVideoProps) {
  const tracks = useAllTracks();
  const ref = useRef<HTMLVideoElement>();
  const containerRef = useRef<HTMLDivElement>();

  const trackData = tracks.find((data) => data.peerId === peerId && data.mediaTag === mediaTag);

  useEffect(() => {
    setTimeout(() => {
      if (!ref.current || !containerRef.current) {
        return;
      }

      if (!trackData || trackData.paused) {
        ref.current.srcObject = null;
        containerRef.current.innerHTML = '';
        return;
      }

      const stream = new MediaStream([trackData.track]);

      ref.current.srcObject = stream;

      const stage = new Konva.Stage({
        container: containerRef.current,
        width: window.innerWidth,
        height: window.innerHeight,
        draggable: true,
      });

      const getDistance = (p1, p2) => Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);

      const getCenter = (p1, p2) => ({
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2,
      });
      let lastCenter = null;
      let lastDist = 0;

      stage.on('touchmove', (e) => {
        e.evt.preventDefault();
        const touch1 = e.evt.touches[0];
        const touch2 = e.evt.touches[1];

        if (touch1 && touch2) {
          if (!stage.isDragging()) {
            stage.stopDrag();
          }

          const p1 = {
            x: touch1.clientX,
            y: touch1.clientY,
          };
          const p2 = {
            x: touch2.clientX,
            y: touch2.clientY,
          };

          if (!lastCenter) {
            lastCenter = getCenter(p1, p2);
            return;
          }
          const newCenter = getCenter(p1, p2);

          const dist = getDistance(p1, p2);

          if (!lastDist) {
            lastDist = dist;
          }

          // local coordinates of center point
          const pointTo = {
            x: (newCenter.x - stage.x()) / stage.scaleX(),
            y: (newCenter.y - stage.y()) / stage.scaleX(),
          };

          const scale = stage.scaleX() * (dist / lastDist);

          stage.scaleX(scale);
          stage.scaleY(scale);

          // calculate new position of the stage
          const dx = newCenter.x - lastCenter.x;
          const dy = newCenter.y - lastCenter.y;

          const newPos = {
            x: newCenter.x - pointTo.x * scale + dx,
            y: newCenter.y - pointTo.y * scale + dy,
          };

          stage.position(newPos);

          lastDist = dist;
          lastCenter = newCenter;
        }
      });

      stage.on('touchend', () => {
        lastDist = 0;
        lastCenter = null;
      });

      const layer = new Konva.Layer();

      const image = new Konva.Image({
        image: ref.current,
        draggable: true,
        width: trackData.track.getSettings().width,
        height: trackData.track.getSettings().height,
        x: 0,
        y: 0,
      });
      layer.add(image);
      stage.add(layer);
      const anim = new Konva.Animation((() => {
        // do nothing, animation just need to update the layer
      }), layer);
      anim.start();
    }, 10);
  }, [trackData?.paused, trackData?.id]);

  if (!trackData || trackData.paused) {
    return noVideo
  }

  return <>
    <video {...props} autoPlay playsInline ref={ref} style={{ display: 'none' }} />
    <div ref={containerRef} />
  </>
}