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
    const svg = document.querySelector('#qrcode-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = size + 40;
    canvas.height = size + 40;

    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20);
        
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = 'qrcode-raptur.png';
        downloadLink.href = pngFile;
        downloadLink.click();
        
        toast.success('QR Code baixado com sucesso!');
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const shareQRCode = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Meu QR Code RAPTUR',
          text: 'Use este QR Code para embarcar no ônibus',
        });
      } catch (error) {
        // Usuário cancelou o compartilhamento
      }
    } else {
      toast.info('Compartilhamento não disponível neste navegador');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="bg-white p-4 rounded-lg" id="qrcode-container">
          <QRCode id="qrcode-svg" value={value} size={size} />
        </div>
        
        <div className="flex gap-2 w-full">
          <Button 
            onClick={downloadQRCode} 
            variant="outline" 
            className="flex-1"
            size="sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Baixar
          </Button>
          <Button 
            onClick={shareQRCode} 
            variant="outline" 
            className="flex-1"
            size="sm"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Compartilhar
          </Button>
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 w-full">
          <p className="text-xs text-center text-muted-foreground">
            🔒 Este é seu <strong>QR Code permanente</strong>. Salve-o no seu celular e use sempre que precisar embarcar. Não expira!
          </p>
        </div>

        {showValue && (
          <p className="text-xs text-muted-foreground text-center break-all max-w-xs">
            {value}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

