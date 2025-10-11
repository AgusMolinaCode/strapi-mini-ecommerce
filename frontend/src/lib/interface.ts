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

export interface ProductoSimple {
  id: number;
  documentId: string;
  titulo: string;
  descripcion: string;
  precio: number;
  precio_anterior: number;
  stock: number;
  slug: string;
  destacado: boolean;
  en_oferta: boolean;
  activo: boolean | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Categoria {
  id: number;
  documentId: string;
  nombre: string;
  descripcion: string;
  slug: string;
  imagen: Imagen;
  productos: ProductoSimple[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Producto {
  id: number;
  documentId: string;
  titulo: string;
  descripcion: string;
  precio: number;
  precio_anterior: number;
  stock: number;
  slug: string;
  destacado: boolean;
  en_oferta: boolean;
  activo: boolean | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  imagenes: Imagen[];
  categoria: Categoria;
}

export interface ProductosResponse {
  data: Producto[];
}

export interface CategoriasResponse {
  data: Categoria[];
}

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