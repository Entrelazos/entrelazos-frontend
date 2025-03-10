export type imageType = 'user_profile' | 'company_profile' | 'company_banner';
export type entityType = 'product' | 'user' | 'company';
export interface UploadType {
  url?: string;
  file: File;
  altText: string;
  description: string;
  entityId: number;
  entityType: entityType;
  imageType: imageType;
}

export interface FileResponseType {
  id: number;
  url: string;
  alt_text: string;
  description: string;
  entity_id: number;
  entity_type: string;
  image_type: string;
  created_at: Date;
  updated_at: Date;
}
