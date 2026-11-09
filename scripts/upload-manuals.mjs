import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const API_BASE = "https://api.openai.com/v1";
const API_KEY = process.env.OPENAI_API_KEY;
const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "data");

if (!API_KEY) {
  console.error("OPENAI_API_KEY 환경변수를 먼저 설정하세요.");
  process.exit(1);
}

const headers = { Authorization: "Bearer " + API_KEY };
async function api(url, options = {}) {
  const response = await fetch(API_BASE + url, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error((data.error && data.error.message) || response.status + " " + response.statusText);
  return data;
}

const list = await readFile(path.join(DATA_DIR, "list.md"), "utf8");
const names = [...list.matchAll(/^\s*[-*]\s+(\S+\.md)\s*$/gm)].map((match) => match[1]);
if (!names.length) throw new Error("data/list.md에서 매뉴얼 파일 목록을 찾지 못했습니다.");

const existingId = process.env.OPENAI_VECTOR_STORE_ID;
const vectorStore = existingId
  ? { id: existingId }
  : await api("/vector_stores", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "Withpayment LENS Manuals" })
    });

console.log("Vector store:", vectorStore.id);
console.log("업로드할 매뉴얼:", names.length);

for (const name of names) {
  const filePath = path.join(DATA_DIR, name);
  const content = await readFile(filePath);
  const form = new FormData();
  form.append("purpose", "assistants");
  form.append("file", new Blob([content], { type: "text/markdown" }), name);
  const uploaded = await api("/files", { method: "POST", body: form });

  const attached = await api("/vector_stores/" + vectorStore.id + "/files", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ file_id: uploaded.id })
  });

  let status = attached.status;
  for (let attempt = 0; attempt < 90 && status !== "completed"; attempt++) {
    if (status === "failed" || status === "cancelled") {
      throw new Error(name + " 색인 실패: " + (attached.last_error?.message || status));
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const current = await api("/vector_stores/" + vectorStore.id + "/files/" + uploaded.id);
    status = current.status;
  }
  if (status !== "completed") throw new Error(name + " 색인 대기 시간이 초과됐습니다.");
  console.log("완료:", name);
}

console.log("\n모든 매뉴얼 색인이 완료됐습니다.");
console.log("OPENAI_VECTOR_STORE_ID=" + vectorStore.id);
console.log("이 ID를 Cloudflare Worker secret에 등록하세요.");
