import { getHeaders, getServerRootURL } from "@/lib/utils";

const headers = getHeaders();
const base = getServerRootURL();

export async function getScripts() {
  const url = base + "script-generation";
  const response = await fetch(url, {
    method: "GET",
    headers: headers
  });
  if(!response.ok || response.status !== 200) {
    throw new Error("Error while getting saved countries")
  }
  return response.json();
}

export async function updateApprovalStatus(payload: any) {
  const url = base + "script-generation/" + payload.id;
  delete payload.id;
  return fetch(url, {
    method: "PUT",
    body: JSON.stringify(payload),
    headers: headers
  });
}
