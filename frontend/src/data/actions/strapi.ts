"use server";

export async function getStrapiData(url: string) {
  const baseUrl = "http://localhost:1337";
  try {
    const response = await fetch(baseUrl + url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function getProductos() {
  const baseUrl = "http://localhost:1337";
  try {
    const response = await fetch(`${baseUrl}/api/productos?populate=*`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function getCategorias() {
  const baseUrl = "http://localhost:1337";
  try {
    const response = await fetch(`${baseUrl}/api/categorias?populate=*`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
