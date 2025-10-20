import QRCode from 'react-qr-code';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="bg-white p-4 rounded-lg">
          <QRCode value={value} size={size} />
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

