// lib/pdf-export.ts

import { Scene } from '@/engine/Scene';
import { ExportUtils } from './export';

export class PDFExport {
  static async exportToPDF(
    scene: Scene,
    options: {
      fileName?: string;
      scale?: number;
      padding?: number;
    } = {}
  ): Promise<void> {
    const {
      fileName = `drawing-${Date.now()}.pdf`,
      scale = 2,
      padding = 20,
    } = options;

    try {
      // First, export to PNG
      const blob = await ExportUtils.exportToPNG(scene, {
        scale,
        padding,
        backgroundColor: '#ffffff',
      });

      // Convert blob to data URL
      const dataUrl = await this.blobToDataURL(blob);

      // Create image to get dimensions
      const img = await this.loadImage(dataUrl);

      // Import jsPDF dynamically
      const { default: jsPDF } = await import('jspdf');

      // Calculate PDF dimensions (A4 default or custom)
      const imgWidth = img.width / scale;
      const imgHeight = img.height / scale;

      // Create PDF with appropriate orientation
      const orientation = imgWidth > imgHeight ? 'landscape' : 'portrait';
      const pdf = new jsPDF({
        orientation,
        unit: 'px',
        format: [imgWidth + padding * 2, imgHeight + padding * 2],
      });

      // Add image to PDF
      pdf.addImage(
        dataUrl,
        'PNG',
        padding,
        padding,
        imgWidth,
        imgHeight,
        undefined,
        'FAST'
      );

      // Save PDF
      pdf.save(fileName);
    } catch (error) {
      console.error('PDF export error:', error);
      throw new Error('Failed to export PDF');
    }
  }

  private static blobToDataURL(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  private static loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }
}