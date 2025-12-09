import { getHeaders, getServerRootURL } from "@/lib/utils";

const headers = getHeaders();
const base = getServerRootURL();

export async function createSponsor(payload: any) {
  const url = base + "sponsor";
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: headers
  });
}

export async function getAllSponsors() {
  const url = base + "sponsor";
  const response = await fetch(url, {
    method: "GET",
    headers: headers
  });
  if(!response.ok || response.status !== 200) {
    throw new Error("Error while getting saved countries")
  }
  return response.json();
}

export async function getActiveSponsors() {
  const url = base + "sponsor/active";
  const response = await fetch(url, {
    method: "GET",
    headers: headers
  });
  if(!response.ok || response.status !== 200) {
    throw new Error("Error while getting saved countries")
  }
  return response.json();
}

export async function updateSponsor(payload: any) {
  const url = base + "sponsor/" + payload.id;
  delete payload.id
  return fetch(url, {
    method: "PUT",
    body: JSON.stringify(payload),
    headers: headers
  });
}
