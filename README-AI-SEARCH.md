# Withpayment LENS AI 검색

이 기능은 기존 LENS 키워드 검색을 유지하면서 별도 AI 질문 검색을 추가합니다.

## 구성

- \`index.html\`: 기존 검색 화면 + AI 검색 패널
- \`lens-ai-search.js\`: 브라우저 UI. API 키를 보관하지 않습니다.
- \`worker/src/index.js\`: Cloudflare Worker. OpenAI Responses API와 File Search를 호출합니다.
- \`scripts/upload-manuals.mjs\`: \`data/list.md\`에 등록된 Markdown 매뉴얼을 OpenAI Vector Store에 업로드합니다.

## 1. 매뉴얼 색인

Node.js 20 이상에서 저장소 루트 폴더로 이동합니다.

PowerShell:
\`\`\`powershell
$env:OPENAI_API_KEY="발급받은_API_키"
node scripts/upload-manuals.mjs
\`\`\`

새 Vector Store를 만들고 \`data/list.md\`에 등록된 14개 매뉴얼 파일을 업로드·색인합니다. 실행 결과에 표시되는 \`vs_...\` ID를 보관하세요.

기존 \`OPENAI_VECTOR_STORE_ID\`를 환경변수로 지정하면 해당 저장소에 업로드합니다. 같은 파일을 반복 업로드하면 중복될 수 있으므로, 매뉴얼 전체를 다시 색인할 때는 새 Vector Store를 만들고 Worker의 ID를 교체하는 방식을 권장합니다.

## 2. Cloudflare Worker 배포

\`\`\`powershell
cd worker
npx wrangler login
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put OPENAI_VECTOR_STORE_ID
npx wrangler deploy
\`\`\`

각 명령에서 실제 값을 입력합니다. API 키와 Vector Store ID는 Git 저장소나 프런트엔드 코드에 넣지 마세요.

\`wrangler.toml\`의 \`ALLOWED_ORIGIN\`을 실제 LENS 사이트의 Origin과 정확히 일치시킵니다. Origin에는 경로를 넣지 않습니다. 기본값은 GitHub Pages 조직 도메인 예시이며, 실제 배포 주소와 다르면 반드시 변경해야 합니다.

\`OPENAI_MODEL\`은 기본 예시값으로 설정되어 있습니다. 사용 계정에서 해당 API 모델을 사용할 수 있는지 확인하고, 필요하면 Worker 변수에서 변경하세요.

배포가 끝나면 출력된 \`https://....workers.dev\` 주소를 복사합니다.

## 3. 프런트엔드 연결

저장소 루트의 \`lens-ai-search.js\` 파일 맨 위에 있는 \`API_URL\` 값을 배포한 Worker 주소로 바꿉니다.

\`\`\`js
const API_URL = "https://실제-Worker-주소.workers.dev";
\`\`\`

변경 사항을 GitHub Pages에 배포한 후 AI 검색을 테스트합니다.

## 4. 동작 확인

- Worker 상태 확인: \`https://실제-Worker-주소.workers.dev/health\`
- 화면에서 "AI 검색"에 질문 입력
- 질문 예시: \`KICC 포스에서 주방전표가 출력되지 않아요. 무엇부터 확인하나요?\`
- 답변 하단의 참고 매뉴얼 파일명이 실제 등록 자료와 일치하는지 확인

## 보안 및 운영 주의

- OpenAI API 키는 Cloudflare Worker Secret으로만 보관합니다.
- \`ALLOWED_ORIGIN\`은 실제 LENS 웹사이트 도메인 하나로 제한합니다.
- Worker는 질문 길이를 2,000자로 제한하고 응답을 캐시하지 않습니다.
- 위험한 조치(보안 기능 해제, DB 삭제, 포맷 등)는 자동 권장하지 않도록 지침을 포함했습니다.
- 매뉴얼에 없는 해결 방법이나 원인을 AI가 만들어내지 않도록 시스템 지침을 적용했습니다.
- 현재 구현에는 사용자 로그인·직원별 권한 인증·요청별 사용량 제한이 포함되지 않았습니다. 공개 사이트에 연결하기 전에 접근제어와 호출량 제한을 추가하는 것이 좋습니다.
- OpenAI API 사용료 및 Vector Store 저장 비용이 발생할 수 있습니다.
- 실제 운영 전 테스트 질문으로 VAN사 혼동, 출처 일치, 미확인 원인 처리, 위험 작업 경고를 검증하세요.

## 현재 적용 범위

이 변경은 개발 브랜치의 코드 추가입니다. Cloudflare 계정 생성·연결, Worker 배포, OpenAI API 키 등록, Vector Store 생성, GitHub Pages 운영 배포는 수행하지 않았습니다.
