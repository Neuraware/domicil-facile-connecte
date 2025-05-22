
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface SignaturePadProps {
  onSave: (signatureDataUrl: string) => void;
  width?: number;
  height?: number;
  className?: string;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  onSave,
  width = 500,
  height = 200,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Set up initial canvas state
    context.lineWidth = 2;
    context.lineCap = 'round';
    context.strokeStyle = '#000';
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    setIsDrawing(true);
    setHasSignature(true);

    // Get correct position
    const rect = canvas.getBoundingClientRect();
    let x, y;
    
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
    context.beginPath();
    context.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Get correct position
    const rect = canvas.getBoundingClientRect();
    let x, y;
    
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
    context.lineTo(x, y);
    context.stroke();
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Convert the canvas to a data URL and pass it to the parent component
    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="border rounded-md overflow-hidden">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
          className="touch-none w-full h-auto bg-white"
        />
      </div>
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={clear}>
          Effacer
        </Button>
        <Button 
          type="button" 
          onClick={saveSignature} 
          disabled={!hasSignature}
        >
          Valider la signature
        </Button>
      </div>
    </div>
  );
};
