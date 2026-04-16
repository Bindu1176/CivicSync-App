import { useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function DocumentViewer({ data, title, onClose }) {
  const canvasRef = useRef(null);
  const { t } = useLanguage();

  const generateDocument = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = 600;
    const h = canvas.height = 800;

    // Background
    ctx.fillStyle = '#FEFCF3';
    ctx.fillRect(0, 0, w, h);

    // Border
    ctx.strokeStyle = '#1a3a4a';
    ctx.lineWidth = 3;
    ctx.strokeRect(15, 15, w - 30, h - 30);
    ctx.strokeRect(20, 20, w - 40, h - 40);

    // Header
    ctx.fillStyle = '#1a3a4a';
    ctx.fillRect(20, 20, w - 40, 80);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GOVERNMENT OF INDIA', w / 2, 55);
    ctx.font = '14px Arial';
    ctx.fillText(title?.toUpperCase() || 'OFFICIAL DOCUMENT', w / 2, 80);

    // CivicSync watermark
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(-Math.PI / 6);
    ctx.fillStyle = 'rgba(26, 58, 74, 0.05)';
    ctx.font = 'bold 60px Arial';
    ctx.fillText('CIVICSYNC', 0, 0);
    ctx.restore();

    // Ashoka emblem symbol
    ctx.fillStyle = '#1a3a4a';
    ctx.font = '40px serif';
    ctx.textAlign = 'center';
    ctx.fillText('☸', w / 2, 140);

    // Document content
    ctx.textAlign = 'left';
    ctx.fillStyle = '#333';
    let y = 180;

    const entries = Object.entries(data || {}).filter(([k, v]) =>
      !['_id', '__v', 'userId', 'id', 'photo', 'image'].includes(k) &&
      typeof v !== 'object'
    );

    entries.forEach(([key, value]) => {
      if (y > h - 100) return;
      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
      ctx.font = '12px Arial';
      ctx.fillStyle = '#666';
      ctx.fillText(label, 50, y);

      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = '#1a3a4a';
      ctx.fillText(String(value), 50, y + 18);

      // Underline
      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(50, y + 25);
      ctx.lineTo(w - 50, y + 25);
      ctx.stroke();

      y += 45;
    });

    // Footer
    ctx.fillStyle = '#1a3a4a';
    ctx.fillRect(20, h - 70, w - 40, 50);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('This is a digitally generated document from CivicSync', w / 2, h - 50);
    ctx.fillText(`Generated on: ${new Date().toLocaleDateString('en-IN')} | Document ID: CS-${Math.random().toString(36).substring(2, 10).toUpperCase()}`, w / 2, h - 35);
  };

  const handleDownload = () => {
    generateDocument();
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const link = document.createElement('a');
      link.download = `CivicSync_${title?.replace(/\s+/g, '_') || 'Document'}_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }, 100);
  };

  // Auto-generate on mount
  setTimeout(generateDocument, 50);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="w-full max-w-md bg-white dark:bg-civic-dark rounded-2xl shadow-2xl overflow-hidden animate-scale-in max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-200 dark:border-civic-border flex items-center justify-between">
          <h3 className="font-display font-bold text-gray-900 dark:text-white">📄 {title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        <div className="flex-1 overflow-auto p-4 flex justify-center bg-gray-100 dark:bg-civic-dark">
          <canvas ref={canvasRef} className="shadow-xl rounded-lg max-w-full h-auto" style={{ maxHeight: '60vh' }}></canvas>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-civic-border">
          <button onClick={handleDownload}
            className="w-full btn-primary flex items-center justify-center gap-2">
            📥 {t('common.download')} to Gallery
          </button>
        </div>
      </div>
    </div>
  );
}
