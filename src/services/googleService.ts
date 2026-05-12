import { google } from 'googleapis';

export interface Product {
  id?: string;
  name: string;
  price: string;
  description: string;
  imageId: string;
  category: string;
}

/**
 * Service to interact with Google Sheets (Database) and Google Drive (Storage)
 * Requires GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN in .env
 */
export class GoogleService {
  private static auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  private static folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  private static spreadsheetId = process.env.GOOGLE_SHEET_ID;

  static {
    if (process.env.GOOGLE_REFRESH_TOKEN) {
      this.auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
    }
  }

  /**
   * Fetches products from Google Sheets
   */
  static async getProducts(): Promise<Product[]> {
    try {
      const sheets = google.sheets({ version: 'v4', auth: this.auth });
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Products!A2:F', // Assumes Header at A1
      });

      const rows = response.data.values;
      if (!rows || rows.length === 0) return [];

      return rows.map((row) => ({
        id: row[0],
        name: row[1],
        price: row[2],
        description: row[3],
        imageId: row[4],
        category: row[5],
      }));
    } catch (error) {
      console.error('Error fetching products from Sheets:', error);
      throw error;
    }
  }

  /**
   * Lists product images from Google Drive folder
   */
  static async getProductImages() {
    try {
      const drive = google.drive({ version: 'v3', auth: this.auth });
      const response = await drive.files.list({
        q: `'${this.folderId}' in parents and mimeType contains 'image/'`,
        fields: 'files(id, name, webViewLink, thumbnailLink)',
      });
      return response.data.files || [];
    } catch (error) {
      console.error('Error fetching images from Drive:', error);
      throw error;
    }
  }

  /**
   * Admin function to add a new product:
   * 1. Uploads image to Drive
   * 2. Appends data to Sheets
   */
  static async addProduct(product: Omit<Product, 'imageId'>, imageStream: any, fileName: string) {
    try {
      const drive = google.drive({ version: 'v3', auth: this.auth });
      const sheets = google.sheets({ version: 'v4', auth: this.auth });

      // 1. Upload Image to Drive
      const driveResponse = await drive.files.create({
        requestBody: {
          name: fileName,
          parents: [this.folderId!],
        },
        media: {
          body: imageStream,
        },
      });

      const imageId = driveResponse.data.id;

      // 2. Append Row to Sheets
      // Row format: ID, Name, Price, Description, ImageId, Category
      const newId = Date.now().toString();
      await sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Products!A:F',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[
            newId,
            product.name,
            product.price,
            product.description,
            imageId,
            product.category
          ]],
        },
      });

      return { success: true, productId: newId, imageId };
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  }
}
