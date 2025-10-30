"use server";

import type {
  PlanLinksResponse,
  SinglePlanLinkResponse,
} from '@/lib/interface';

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

export async function getPlanLinks(): Promise<PlanLinksResponse | undefined> {
  try {
    const response = await fetch(`${baseUrl}/api/planes-links`, {
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.warn('Plan links endpoint not configured yet. Create "planes-links" content type in Strapi.');
        return { data: [], meta: {} };
      }
      console.error(`Error fetching plan links: ${response.status}`);
      return { data: [], meta: {} };
    }

    const data: PlanLinksResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error in getPlanLinks:', error);
    return { data: [], meta: {} };
  }
}

export async function getPlanLinkById(id: string): Promise<SinglePlanLinkResponse | undefined> {
  try {
    const response = await fetch(`${baseUrl}/api/planes-links/${id}`, {
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Plan link ${id} not found or endpoint not configured.`);
        return undefined;
      }
      console.error(`Error fetching plan link ${id}: ${response.status}`);
      return undefined;
    }

    const data: SinglePlanLinkResponse = await response.json();
    return data;
  } catch (error) {
    console.error(`Error in getPlanLinkById(${id}):`, error);
    return undefined;
  }
}


