import express from 'express';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
const app: express.Application = express();
// Define interfaces for the expected request body

class SalariesControllers {
   async generatePDF(req: express.Request, res: express.Response) {
      try {
         const data = req.body;
         const imagePath = path.resolve(__dirname, '../../public/images/logo1.png');
         const imageBase64 = fs.readFileSync(imagePath, 'base64');
         // Render the EJS template to HTML string
         res.render('template', { ...data, imageBase64 }, async (err, html) => {
            if (err) {
               console.error('Error rendering EJS template:', err);
               return res.status(500).send('Error rendering template');
            }

            // Inject Bootstrap styles dynamically into the HTML
            const stylePath = path.resolve(__dirname, '../../views/bootstrap.min.css');
            const bootstrapStyles = fs.readFileSync(stylePath, 'utf-8');
            let finalHtml = html.replace('</head>', `<style>${bootstrapStyles}</style></head>`);

            // Launch Puppeteer to generate PDF from rendered HTML
            const browser = await puppeteer.launch({
               headless: true,
               args: ['--no-sandbox', '--disable-setuid-sandbox'],
            });
            const page = await browser.newPage();
            await page.setContent(finalHtml, { waitUntil: 'networkidle2' });

            // Generate PDF
            const pdf = await page.pdf({ format: 'A4', printBackground: true });

            await browser.close();

            // Set headers and send the PDF as a response
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename="salary-receipt.pdf"');
            res.end(pdf);  // Send the PDF buffer as a response
         });
      } catch (error) {
         console.error('Error generating PDF:', error);
         res.status(500).send(error);
      }
   }


}

export default new SalariesControllers();
