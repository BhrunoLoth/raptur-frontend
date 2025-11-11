import { useRef } from 'react';
import QRCode from 'qrcode.react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface QRCodeDisplayProps {
  value: string;
  title?: string;
  size?: number;
}

export default function QRCodeDisplay({
  value,
  title = 'Seu QR Code',
  size = 200,
}: QRCodeDisplayProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `qrcode-${Date.now()}.png`;
    link.click();
  };

  if (!value) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>QR Code não disponível</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            O código ainda não foi gerado ou não está disponível.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="text-center">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex flex-col items-center">
        
        {/* QR CODE */}
        <div ref={qrRef} className="p-4 bg-white rounded-lg shadow">
          <QRCode value={value} size={size} level="H" includeMargin />
        </div>

        <p className="text-xs text-muted-foreground break-all">
          {value}
        </p>

        <Button onClick={downloadQR} variant="outline" className="w-full">
          Baixar QR Code
        </Button>
      </CardContent>
    </Card>
  );
}
