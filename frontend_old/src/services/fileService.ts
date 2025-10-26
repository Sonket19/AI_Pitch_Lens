// FIX: Corrected import path for ImageData
import { ImageData } from '../types';

// This declaration informs TypeScript that 'pdfjsLib' will be available in the global scope,
// provided by the script tag in index.html.
declare const pdfjsLib: any;

export const pdfToImages = async (file: File): Promise<ImageData[]> => {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument(new Uint8Array(arrayBuffer));
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;
    const images: ImageData[] = [];
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('Could not create canvas context');
    }

    // Limit processing to 20 pages to avoid overly large API requests
    const maxPagesToProcess = Math.min(numPages, 20);

    for (let i = 1; i <= maxPagesToProcess; i++) {
        const page = await pdf.getPage(i);
        // Use a fixed scale to ensure images are not excessively large
        const viewport = page.getViewport({ scale: 1.5 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: ctx,
            viewport: viewport,
        };
        await page.render(renderContext).promise;
        
        // Convert canvas to JPEG for smaller file size and get base64 data
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        images.push({
            mimeType: 'image/jpeg',
            data: imageDataUrl.split(',')[1], // Remove the "data:image/jpeg;base64," prefix
        });
    }

    // Clean up the created canvas element
    canvas.remove();

    return images;
};
