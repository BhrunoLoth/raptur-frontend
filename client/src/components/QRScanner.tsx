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
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameras, setCameras] = useState<any[]>([]);
  const [selectedCamera, setSelectedCamera] = useState('');

  useEffect(() => {
    loadCameras();
    return () => cleanupScanner();
  }, []);

  const loadCameras = async () => {
    try {
      const devices = await Html5Qrcode.getCameras();
      setCameras(devices);

      if (devices.length > 0) {
        const backCamera = devices.find(d =>
          d.label?.toLowerCase().includes('back') ||
          d.label?.toLowerCase().includes('traseira')
        );

        setSelectedCamera(backCamera?.id || devices[0].id);
      }
    } catch (error) {
      toast.error('Erro ao acessar câmera');
      onError?.('Erro ao acessar câmera');
    }
  };

  const cleanupScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch {}
      scannerRef.current = null;
      setIsScanning(false);
    }
  };

  const startScanning = async () => {
    if (!selectedCamera) {
      toast.error('Nenhuma câmera encontrada');
      return;
    }

    await cleanupScanner();

    try {
      const scanner = new Html5Qrcode('qr-reader', { verbose: false });
      scannerRef.current = scanner;

      await scanner.start(
        selectedCamera,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          cleanupScanner();
          onScan(decodedText);
        },
        () => {}
      );

      setIsScanning(true);
    } catch (error: any) {
      toast.error('Falha ao iniciar câmera');
      onError?.(error?.message || 'Erro ao iniciar scanner');
    }
  };

  const stopScanning = () => cleanupScanner();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Scanner QR Code</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Selecionar câmera */}
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
                  {camera.label || `Câmera ${camera.id}`}
                </option>
              ))}
            </select>
          </div>
        )}

        <div
          id="qr-reader"
          className="w-full rounded-lg overflow-hidden bg-black min-h-[260px]"
        />

        <Button
          onClick={isScanning ? stopScanning : startScanning}
          variant={isScanning ? 'destructive' : 'default'}
          className="w-full"
        >
          {isScanning ? 'Parar Scanner' : 'Iniciar Scanner'}
        </Button>
      </CardContent>
    </Card>
  );
}
