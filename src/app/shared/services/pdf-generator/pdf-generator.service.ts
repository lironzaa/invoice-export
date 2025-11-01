import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';

import { PdfDocumentData } from '../../interfaces/pdf-config.interface';

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {
  private readonly fontFamily = 'helvetica';
  private readonly fontStyle = {
    bold: 'bold',
    normal: 'normal'
  };
  private readonly fontSize = {
    title: 20,
    section: 12
  };
  private readonly margin = 20;
  private readonly spacing = {
    afterTitle: 15,
    afterSectionHeader: 10,
    betweenFields: 8,
    betweenSections: 5
  };
  private readonly signature = {
    width: 100,
    height: 50
  };

  generatePDF(data: PdfDocumentData): Blob {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = this.margin;

    // Title
    doc.setFontSize(this.fontSize.title);
    doc.text(data.title, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += this.spacing.afterTitle;

    // Sections
    data.sections.forEach(section => {
      doc.setFontSize(this.fontSize.section);
      doc.setFont(this.fontFamily, this.fontStyle.bold);
      doc.text(`${section.title}:`, this.margin, yPosition);
      yPosition += this.spacing.afterSectionHeader;

      doc.setFont(this.fontFamily, this.fontStyle.normal);
      section.fields.forEach(field => {
        if (field.value !== null && field.value !== undefined) {
          doc.text(`${field.label}: ${field.value}`, this.margin, yPosition);
          yPosition += this.spacing.betweenFields;
        }
      });

      yPosition += this.spacing.betweenSections;
    });

    // Signature
    if (data.signature) {
      doc.setFontSize(this.fontSize.section);
      doc.setFont(this.fontFamily, this.fontStyle.bold);
      doc.text('Signature:', this.margin, yPosition);
      yPosition += this.spacing.afterSectionHeader;

      try {
        doc.addImage(data.signature, 'PNG', this.margin, yPosition, this.signature.width, this.signature.height);
      } catch (error) {
        console.error('Failed to add signature image:', error);
        doc.setFont(this.fontFamily, this.fontStyle.normal);
        doc.text('[Signature could not be rendered]', this.margin, yPosition);
      }
    }

    return doc.output('blob');
  }
}