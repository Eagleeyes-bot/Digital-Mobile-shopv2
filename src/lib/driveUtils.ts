/**
 * Converts a Google Drive File ID into a direct viewable URL.
 * If the input already starts with http, it is returned as is.
 * Uses the uc?export=view structure for Drive IDs.
 */
export const getDriveImageUrl = (id: string | undefined): string => {
  if (!id) return '';
  
  // If it's already an external URL, just return it
  if (id.trim().startsWith('http')) {
    return id.trim();
  }

  // Support both full Drive URLs and raw IDs
  const rawId = id.includes('id=') ? id.split('id=')[1] : id;
  return `https://drive.google.com/uc?export=view&id=${rawId}`;
};
