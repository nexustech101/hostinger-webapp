import { useEffect, useRef } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  level?: "L" | "M" | "Q" | "H";
  includeMargin?: boolean;
}

/**
 * QR Code Generator using Canvas
 * Generates QR codes without external library dependencies
 */
export function QRCodeGenerator({
  value,
  size = 200,
  level = "M",
  includeMargin = true,
}: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // For simplicity, we'll create a basic QR code using a data URL from QR API
    // In production, use qrcode.react library: npm install qrcode.react
    const generateQRCode = async () => {
      try {
        const encodedValue = encodeURIComponent(value);
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedValue}`;

        const response = await fetch(qrCodeUrl);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (!canvas) return;

          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          canvas.width = size;
          canvas.height = size;
          ctx.drawImage(img, 0, 0);

          URL.revokeObjectURL(url);
        };
        img.src = url;
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    };

    generateQRCode();
  }, [value, size]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "stripe-payment-qr.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas
        ref={canvasRef}
        className="border-2 border-border rounded-lg p-2 bg-white dark:bg-card"
        style={{ width: size, height: size }}
      />
      <Button
        onClick={handleDownload}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <Download size={16} />
        Download QR Code
      </Button>
    </div>
  );
}
