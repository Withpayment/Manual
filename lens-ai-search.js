(() => {
  "use strict";
  // Cloudflare Worker endpoint for LENS AI search.
  const API_URL = "https://withpayment-lens-ai.khk4987.workers.dev";
  const form = document.getElementById("lensAiForm");
  const question = document.getElementById("lensAiQuestion");
  const submit = document.getElementById("lensAiSubmit");
  const status = document.getElementById("lensAiStatus");
  const answer = document.getElementById("lensAiAnswer");
  const sources = document.getElementById("lensAiSources");

  if (!form || !question || !submit || !status || !answer || !sources) return;

  const setBusy = (busy) => {
    submit.disabled = busy;
    submit.textContent = busy ? "답변 작성 중…" : "AI에게 질문";
    question.disabled = busy;
  };

  const showStatus = (message, isError = false) => {
    status.textContent = message;
    status.classList.toggle("error", isError);
  };

  const renderSources = (items) => {
    sources.replaceChildren();
    if (!Array.isArray(items) || !items.length) return;
    const heading = document.createElement("strong");
    heading.textContent = "참고한 매뉴얼";
    sources.append(heading);
    const list = document.createElement("ul");
    items.forEach((item) => {
      const li = document.createElement("li");
      const name = item.filename || "매뉴얼 자료";
      li.textContent = name + (Number.isFinite(item.score) ? " · 관련도 " + Math.round(item.score * 100) + "%" : "");
      list.append(li);
    });
    sources.append(list);
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const text = question.value.trim();
    if (!text) {
      showStatus("질문을 입력해 주세요.", true);
      question.focus();
      return;
    }
    if (API_URL.includes("YOUR-WORKER-NAME") || !/^https:\/\/.+/.test(API_URL)) {
      showStatus("AI 서버 주소 설정이 필요합니다. lens-ai-search.js의 API_URL을 배포한 Worker 주소로 변경해 주세요.", true);
      return;
    }

    setBusy(true);
    showStatus("매뉴얼에서 관련 내용을 찾고 있습니다.");
    answer.textContent = "";
    sources.replaceChildren();

    try {
      const response = await fetch(API_URL.replace(/\/$/, "") + "/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "AI 검색 요청에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      }
      answer.textContent = data.answer || "매뉴얼에서 답변을 생성하지 못했습니다.";
      renderSources(data.sources);
      showStatus(data.sources && data.sources.length ? "매뉴얼 검색 결과를 바탕으로 작성한 답변입니다." : "답변의 참고 문서를 확인하지 못했습니다. 내용을 추가 확인해 주세요.");
    } catch (error) {
      showStatus(error.message || "네트워크 오류가 발생했습니다.", true);
    } finally {
      setBusy(false);
    }
  });
})();
