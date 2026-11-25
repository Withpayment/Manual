# UP오더 · POS 연동 공식 장애 대응
종류: 문제해결
VAN: KPN
장비: 테이블오더

## UP오더 연결 또는 VAN 설정 오류 발생
모델: UP오더 / UP POS
표시: 아임유 공식 1차 공통 조치 · 주의 사항 포함
키워드: 업오더 연결안됨 VAN 오류 결제 연동 실패 데이터 캐시
원인: POS·UP오더 버전 불일치 또는 설정 데이터 문제 가능
- 1. 상태 기록 = 오류 메시지와 주문·결제 내역을 먼저 확인 ※ 중복 승인 여부 확인
- 2. 버전 확인 = UP POS 및 UP오더 버전 확인 > 필요한 경우 최신 버전으로 업데이트
- 3. 설정 점검 = UP오더 연결 및 VAN 설정을 공식 문서와 비교
- 4. 재실행 = UP POS와 UP오더 모두 재실행 후 테스트
- 5. 데이터 초기화 = 공식 안내에는 UP오더 데이터·캐시 삭제 후 재설정이 포함됨 ※ 계정·테이블 매칭·VAN 설정 백업 및 복원 가능 여부를 확인한 관리자만 수행
- 6. 반복 발생 = 공식 장애 대응 매뉴얼 v1.4를 확인하고 기술지원 요청
- 공식 1차 조치 = https://imupos.com/kr/sub/support/uporder_view/?b_idx=421&bid=21&page=1&s_cate=&s_keyword=&s_type=
- 공식 장애 매뉴얼 = https://imupos.com/kr/sub/support/manual_view/?b_idx=2303&page=1&s_cate=%EA%B8%B0%ED%83%80&s_keyword=&s_type=

## UP오더 KICC 이지포스 연동 확인
VAN: KICC
장비: 테이블오더
모델: UP오더 + 이지포스
표시: 공식 연동 매뉴얼 위치 확인 · 세부 설정은 원본 참조
키워드: 업오더 KICC 이지포스 연동 연결 장애
- 1. 모델 확인 = 실제 POS가 KICC 이지포스인지 확인
- 2. 원본 확인 = 공식 UP오더 이지포스(KICC) 연동 매뉴얼 확인
- 3. 점검 = 현재 프로그램 버전과 연결 상태를 기록한 뒤 원본의 설정 절차와 대조
- 4. 주의 = 다른 VAN의 통신 설정값을 복사하지 않기
- 공식 연동 자료 = https://imupos.com/kr/sub/support/manual_view/?b_idx=2234&page=1&s_cate=&s_keyword=&s_type=

## UP오더 결제 모드 또는 주문 서버 설정 확인
VAN: KPN
장비: 테이블오더
모델: UP오더 / IMUPOS 통합매뉴얼 v1.0 기준
표시: 공식 통합매뉴얼 기준 · 버전별 상이
키워드: 업오더 주문서버 IP 결제모드 와이파이 QR
- 주문 서버 = UP오더 태블릿과 연결할 메인 POS의 IP 주소 입력 ※ 메인 POS는 고정 IP 권장
- 결제 모드 = UP오더에서 신용카드 결제를 사용할 때 설정
- 와이파이 = POS·태블릿이 연결된 유무선 공유기의 Wi-Fi 정보 설정
- QR = 태블릿 설정에 필요한 로그인·와이파이 정보를 POS에서 인쇄 가능
- 주의 = 기존 IP·Wi-Fi·결제 설정을 변경하기 전 현재 설정을 기록하고 현장 관리자에게 확인
- 공식 통합매뉴얼 = https://imupos.com/upload/IMUPOS%20%ED%86%B5%ED%95%A9%EB%A7%A4%EB%89%B4%EC%96%BC_v1.0.pdf
