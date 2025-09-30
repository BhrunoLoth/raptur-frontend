// src/components/CameraCapture.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, Aperture } from 'lucide-react';

export default function CameraCapture({ onCapture, onCancel }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (e) {
        setErr('Erro ao acessar câmera. Verifique as permissões.');
        console.error(e);
      }
    })();
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, []);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      const file = new File([blob], 'foto-capturada.jpg', { type: 'image/jpeg' });
      onCapture?.(file, canvas.toDataURL('image/jpeg', 0.9));
    }, 'image/jpeg', 0.9);
  };

  return (
    <div style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>
      {err && <p style={{ color: 'red' }}>{err}</p>}
      <video ref={videoRef} autoPlay playsInline style={{ width: '100%', borderRadius: 6 }} />
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button type="button" onClick={handleCapture} style={{ display: 'flex', gap: 6 }}>
          <Aperture size={16} /> Capturar
        </button>
        <button type="button" onClick={onCancel} style={{ display: 'flex', gap: 6 }}>
          <CameraOff size={16} /> Fechar câmera
        </button>
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
