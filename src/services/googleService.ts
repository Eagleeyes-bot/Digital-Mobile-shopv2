import { google } from 'googleapis';

export interface Product {
  id?: string;
  imei: string;
  name: string;
  colour: string;
  storage: string;
  brand: string;
  condition: 'NEW' | 'SECOND';
  batteryHealth: string;
  imageId: string;
  infoLink: string;
  region: string;
  qty: string;
  price: string;
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
   * Helper to get the inventory sheet name and ID
   */
  private static async getSheetInfo() {
    const sheets = google.sheets({ version: 'v4', auth: this.auth });
    const metadata = await sheets.spreadsheets.get({
      spreadsheetId: this.spreadsheetId,
    });

    const sheet = metadata.data.sheets?.find(s => s.properties?.title === 'Products') || metadata.data.sheets?.[0];
    
    if (!sheet || !sheet.properties) {
      throw new Error('Could not find inventory sheet.');
    }

    return {
      title: sheet.properties.title || 'Products',
      sheetId: sheet.properties.sheetId ?? 0
    };
  }

  /**
   * Fetches products from Google Sheets
   */
  static async getProducts(): Promise<Product[]> {
    try {
      const sheets = google.sheets({ version: 'v4', auth: this.auth });
      const { title } = await this.getSheetInfo();

      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${title}!A2:M`, // ID, IMEI, Name, Colour, Storage, Brand, Condition, Battery, ImageId, InfoLink, Region, Qty, Price
      });

      const rows = response.data.values;
      if (!rows || rows.length === 0) return [];

      return rows.map((row) => ({
        id: row[0] || '',
        name: row[1] || 'Unlabeled Phone',
        colour: row[2] || '',
        storage: row[3] || '',
        batteryHealth: row[4] || '',
        imei: row[5] || '',
        region: row[6] || '',
        brand: row[7] || '',
        qty: row[8] || '0',
        price: row[9] || '0',
        imageId: row[10] || '',
        infoLink: row[11] || '',
        condition: (row[12] as 'NEW' | 'SECOND') || 'NEW',
      }));
    } catch (error: any) {
      console.error('Error fetching products from Sheets:', error);
      // Re-throw specific range error with a more helpful message
      if (error.message?.includes('Unable to parse range')) {
         throw new Error(`The sheet 'Products' was not found. Please rename your sheet tab to exactly 'Products'.`);
      }
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
   * 1. (Optional) Uploads image to Drive
   * 2. Appends data to Sheets
   */
  static async addProduct(product: Omit<Product, 'imageId'> & { imageId?: string }, imageStream?: any, fileName?: string, mimeType?: string) {
    try {
      const drive = google.drive({ version: 'v3', auth: this.auth });
      const sheets = google.sheets({ version: 'v4', auth: this.auth });
      const { title } = await this.getSheetInfo();

      let imageId = product.imageId || '';

      // 1. Upload Image to Drive if stream is provided
      if (imageStream && fileName) {
        const driveResponse = await drive.files.create({
          requestBody: {
            name: fileName,
            parents: [this.folderId!],
          },
          media: {
            mimeType: mimeType || 'image/jpeg',
            body: imageStream,
          },
        });
        imageId = driveResponse.data.id || '';
      }

      if (!imageId) {
        throw new Error('Image reference (Drive ID or URL) is required.');
      }

      // 2. Append Row to Sheets
      const newId = Date.now().toString();
      await sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: `${title}!A:M`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[
            newId,
            product.name,
            product.colour,
            product.storage,
            product.batteryHealth,
            product.imei,
            product.region,
            product.brand,
            product.qty,
            product.price,
            imageId,
            product.infoLink,
            product.condition
          ]],
        },
      });

      return { success: true, productId: newId, imageId };
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  }

  /**
   * Admin function to delete a product:
   * 1. Removes row from Sheets
   * 2. (Optional) Deletes image from Drive
   */
  static async deleteProduct(id: string) {
    try {
      const sheets = google.sheets({ version: 'v4', auth: this.auth });
      const { title, sheetId } = await this.getSheetInfo();
      
      // Find the row index
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${title}!A:A`,
      });

      const rows = response.data.values || [];
      const rowIndex = rows.findIndex(row => row[0] === id);

      if (rowIndex === -1) {
        throw new Error('Product not found in database.');
      }

      // Delete the row
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.spreadsheetId,
        requestBody: {
          requests: [
            {
              deleteDimension: {
                range: {
                  sheetId,
                  dimension: 'ROWS',
                  startIndex: rowIndex,
                  endIndex: rowIndex + 1
                }
              }
            }
          ]
        }
      });

      return { success: true };
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  /**
   * Admin function to update a product
   */
  static async updateProduct(id: string, product: Partial<Product>) {
    try {
      const sheets = google.sheets({ version: 'v4', auth: this.auth });
      const { title } = await this.getSheetInfo();
      
      // Find the row index
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${title}!A:A`,
      });

      const rows = response.data.values || [];
      const rowIndex = rows.findIndex(row => row[0] === id);

      if (rowIndex === -1) {
        throw new Error('Product not found in database.');
      }

      // Update the row
      // We need the existing row data to merge
      const existingRowResponse = await sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${title}!A${rowIndex + 1}:M${rowIndex + 1}`,
      });

      const existingRow = existingRowResponse.data.values?.[0] || [];
      
      const updatedRow = [
        id,
        product.name ?? existingRow[1],
        product.colour ?? existingRow[2],
        product.storage ?? existingRow[3],
        product.batteryHealth ?? existingRow[4],
        product.imei ?? existingRow[5],
        product.region ?? existingRow[6],
        product.brand ?? existingRow[7],
        product.qty ?? existingRow[8],
        product.price ?? existingRow[9],
        product.imageId ?? existingRow[10],
        product.infoLink ?? existingRow[11],
        product.condition ?? existingRow[12],
      ];

      await sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `${title}!A${rowIndex + 1}:M${rowIndex + 1}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [updatedRow],
        },
      });

      return { success: true };
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }
}
