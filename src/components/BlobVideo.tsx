import { forwardRef, useMemo } from 'react';

export interface BlobVideoProps {
  blob?: Blob | null;
  onLoaded?: React.ReactEventHandler<HTMLVideoElement>;
}

export const BlobVideo = forwardRef<HTMLVideoElement, BlobVideoProps>(
  ({ blob, onLoaded }, ref) => {
    const url = useMemo(() => (blob ? URL.createObjectURL(blob) : ''), [blob]);

    return (
      <video
        preload="metadata"
        ref={ref}
        src={url}
        autoPlay
        controls
        onLoadedData={onLoaded}
      >
        <source type="video/webm" />
      </video>
    );
  }
);

export default BlobVideo;
