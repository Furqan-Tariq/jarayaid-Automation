import { getHeaders, getServerRootURL } from "@/lib/utils";

const headers = getHeaders();
const base = getServerRootURL();

export async function createJoiningWord(payload: any) {
  const url = base + "joining-words";
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: headers
  });
}

export async function getAll() {
  const url = base + "joining-words";
  const response = await fetch(url, {
    method: "GET",
    headers: headers
  });
  if(!response.ok || response.status !== 200) {
    throw new Error("Error while getting saved countries")
  }
  return response.json();
}

export async function getActiveJoiningWords() {
  const url = base + "joining-words/active";
  const response = await fetch(url, {
    method: "GET",
    headers: headers
  });
  if(!response.ok || response.status !== 200) {
    throw new Error("Error while getting saved countries")
  }
  return response.json();
}

export async function updateJoiningWord(payload: any) {
  const url = base + "joining-words/" + payload.id;
  delete payload.id;
  return fetch(url, {
    method: "PUT",
    body: JSON.stringify(payload),
    headers: headers
  });
}

export async function updateJoiningWordStatus(payload: any) {
  const url = base + "joining-words/updateJoiningWords/" + payload.id;
  delete payload.id;
  return fetch(url, {
    method: "PUT",
    body: JSON.stringify(payload),
    headers: headers
  });
}

export async function getAllConfigurations() {
  const url = base + "script-configuration";
  const response = await fetch(url, {
    method: "GET",
    headers: headers
  });
  if(!response.ok || response.status !== 200) {
    throw new Error("Error while getting saved countries")
  }
  return response.json();
}

export async function addConfig(payload: any) {
  const url = base + "script-configuration";
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: headers
  });
}

export async function updateConfig(payload: any) {
  const url = base + "script-configuration/" + payload.id;
  delete payload.id;
  return fetch(url, {
    method: "PUT",
    body: JSON.stringify(payload),
    headers: headers
  });
}

export async function updateConfigStatus(payload: any) {
  const url = base + "script-configuration/updateScriptConfiguration/" + payload.id;
  delete payload.id;
  return fetch(url, {
    method: "PUT",
    body: JSON.stringify(payload),
    headers: headers
  });
}
