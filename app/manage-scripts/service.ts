import { getHeaders, getServerRootURL } from "@/lib/utils";

const headers = getHeaders();
const base = getServerRootURL();

export async function generateVideo(payload: any) {
  const url = base + "heygen/generate-news";
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: headers
  });
}
