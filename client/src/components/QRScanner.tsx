import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';

interface QRScannerProps {
  onScan: (data: string) => void;
  onError?: (error: string) => void;
}

export default function QRScanner({ onScan, onError }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [cameras, setCameras] = useState<any[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');

  useEffect(() => {
    loadCameras();
    return () => stopScanning();
  }, []);

  const loadCameras = async () => {
    try {
      const devices = await Html5Qrcode.getCameras();
      setCameras(devices);

      if (devices.length > 0) {
        const backCamera = devices.find(d => d.label.toLowerCase().includes('back'));
        setSelectedCamera(backCamera?.id || devices[0].id);
      }
    } catch (error) {
      console.error('Erro ao carregar câmeras:', error);
      onError?.('Erro ao acessar câmera');
      toast.error('Erro ao acessar câmera');
    }
  };

  const startScanning = async () => {
    if (!selectedCamera) {
      onError?.('Nenhuma câmera disponível');
      toast.error('Nenhuma câmera disponível');
      return;
    }

    try {
      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;

      await scanner.start(
        selectedCamera,
        { fps: 12, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          onScan(decodedText);
          stopScanning();
        }
      );

      setIsScanning(true);
    } catch (error: any) {
      console.error('Erro ao iniciar scanner:', error);
      toast.error(error.message || 'Erro ao iniciar scanner');
      onError?.(error.message || 'Erro ao iniciar scanner');
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
        scannerRef.current = null;
      } catch (error) {
        console.warn('Erro ao parar scanner:', error);
      }
    }
    setIsScanning(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Scanner QR Code</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {cameras.length > 1 && !isScanning && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Selecionar Câmera</label>
            <select
              value={selectedCamera}
              onChange={(e) => setSelectedCamera(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              {cameras.map((camera) => (
                <option key={camera.id} value={camera.id}>
                  {camera.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div id="qr-reader" className="w-full rounded-lg overflow-hidden bg-black min-h-[260px]" />

        <div className="flex gap-2">
          {!isScanning ? (
            <Button onClick={startScanning} className="w-full">
              Iniciar Scanner
            </Button>
          ) : (
            <Button onClick={stopScanning} variant="destructive" className="w-full">
              Parar Scanner
            </Button>
          )}
        </div>

      </CardContent>
    </Card>
  );
}
