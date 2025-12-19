import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (base64: string) => void;
  onClose: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    startCamera();
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // Prefer back camera on mobile
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Unable to access camera. Please allow permissions.');
      console.error(err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Match canvas size to video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        onCapture(dataUrl);
        stopCamera();
      }
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg flex flex-col items-center gap-2">
        <p className="text-red-600 text-center">{error}</p>
        <button onClick={onClose} className="text-sm underline text-red-700">Close</button>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[3/4] md:aspect-video bg-black rounded-lg overflow-hidden group">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Overlay Controls */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-6 z-10">
        <button 
          onClick={onClose}
          className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
        >
          <X size={24} />
        </button>
        
        <button 
          onClick={takePhoto}
          className="p-1 rounded-full border-4 border-white/50 hover:border-white transition-all"
        >
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
             <Camera className="text-slate-900" size={28} />
          </div>
        </button>
        
        <button 
          onClick={() => { stopCamera(); startCamera(); }}
          className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
        >
          <RefreshCw size={24} />
        </button>
      </div>
    </div>
  );
};

export default CameraCapture;
