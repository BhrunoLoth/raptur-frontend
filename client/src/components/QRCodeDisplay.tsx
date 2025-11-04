import QRCode from 'react-qr-code';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Download, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface QRCodeDisplayProps {
  value: string;
  title?: string;
  size?: number;
  showValue?: boolean;
}

export default function QRCodeDisplay({ 
  value, 
  title = 'QR Code', 
  size = 256,
  showValue = false 
}: QRCodeDisplayProps) {

  const downloadQRCode = () => {
    try {
      const svg = document.querySelector('#qrcode-svg') as SVGSVGElement;
      if (!svg) return;

      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      canvas.width = size + 40;
      canvas.height = size + 40;
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);

      img.onload = () => {
        if (ctx) {
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 20, 20);

          const pngFile = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.download = `qrcode-raptur.png`;
          link.href = pngFile;
          link.click();
          toast.success('✅ QR Code baixado com sucesso!');
        }
      };
    } catch (err) {
      toast.error('Erro ao baixar QR Code');
    }
  };

  const shareQRCode = async () => {
    if (!navigator.share) {
      toast.info('Compartilhamento não suportado neste dispositivo.');
      return;
    }

    try {
      await navigator.share({
        title: 'Meu QR Code RAPTUR',
        text: 'Use este QR Code para embarcar no ônibus.',
      });
    } catch {
      // cancelado
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <QRCode id="qrcode-svg" value={value} size={size} />
        </div>

        <div className="grid grid-cols-2 gap-2 w-full">
          <Button variant="outline" onClick={downloadQRCode}>
            <Download className="w-4 h-4 mr-2" />
            Baixar
          </Button>

          <Button variant="outline" onClick={shareQRCode}>
            <Share2 className="w-4 h-4 mr-2" />
            Compartilhar
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center bg-primary/10 border border-primary/20 rounded-lg p-3">
          🔒 Este é seu <strong>QR Code permanente</strong>.
        </p>

        {showValue && (
          <p className="text-xs text-muted-foreground text-center break-all max-w-xs">
            {value}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
