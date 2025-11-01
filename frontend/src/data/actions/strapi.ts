"use server";

const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export async function getStrapiData(url: string) {
  try {
    const response = await fetch(baseUrl + url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function getPlans() {
  try {
    const response = await fetch(`${baseUrl}/api/plans?populate=*`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}


