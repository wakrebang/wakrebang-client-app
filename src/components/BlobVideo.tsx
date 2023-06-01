import { useMemo } from 'react';

interface BlobVideoProps {
  blob?: Blob | null;
}
export const BlobVideo: React.FC<BlobVideoProps> = ({ blob }) => {
  const url = useMemo(() => (blob ? URL.createObjectURL(blob) : ''), [blob]);

  return <video autoPlay controls src={url}></video>;
};

export default BlobVideo;
