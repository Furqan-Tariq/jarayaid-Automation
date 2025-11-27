import { getHeaders, getServerRootURL } from "@/lib/utils";

const headers = getHeaders();
const base = getServerRootURL();

export async function post(payload: any) {
  const url = base + "country-sources";
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: headers
  });
}

export async function getAll() {
  const url = base + "country-sources";
  const response = await fetch(url, {
    method: "GET",
    headers: headers
  });
  if(!response.ok || response.status !== 200) {
    throw new Error("Error while getting saved countries")
  }
  return response.json();
}

export async function update(payload: any) {
  const url = base + "country-sources/" + payload.id;
  return fetch(url, {
    method: "PUT",
    body: JSON.stringify(payload),
    headers: headers
  });
}
