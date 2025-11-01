export interface ImageFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: string | null;
  width: number;
  height: number;
  size: number;
  sizeInBytes: number;
  url: string;
}

export interface ImageFormats {
  thumbnail?: ImageFormat;
  large?: ImageFormat;
  medium?: ImageFormat;
  small?: ImageFormat;
}

export interface Imagen {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: ImageFormats;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: any;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Alias for compatibility
export type StrapiImage = Imagen;

// HomePage interface
export interface HomePage {
  id: number;
  documentId: string;
  title: string;
  description: string;
  imagen: Imagen;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Generic Strapi Response wrapper
export interface StrapiResponse<T> {
  data: T;
  meta: Record<string, any>;
}

// ============================================
// PLANS - Planes y suscripciones
// ============================================

export interface PlanFeature {
  id: number;
  text: string;
}

export interface PlanFeatureFull {
  id: number;
  text: string;
}

export interface Plan {
  id: number;
  documentId: string;
  nombre: string;
  precio: number;
  periodo: string;
  popular: boolean | null;
  plan_id: string;
  url: string;
  feature: PlanFeature[];
  feature_full: PlanFeatureFull[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface PlansResponse {
  data: Plan[];
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
