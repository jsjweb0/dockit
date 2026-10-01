# Resume 출력 수동 검증

개발 서버(`npm run dev`)에서만 사용합니다. fixture는 production sample과 분리되어 있습니다.

Chrome 개발자 도구 Console에서 아래 코드를 실행합니다. 전용 문서 ID만 덮어쓰며 기존 사용자 문서는 변경하지 않습니다.

```js
const { default: resume } = await import('/src/test/fixtures/resume-long.json');
localStorage.setItem('resume:dockit-output-qa', JSON.stringify(resume));
location.assign('/resume/dockit-output-qa');
```

빈 선택 정보는 import 경로를 `/src/test/fixtures/resume-empty-optional.json`으로 바꿔 확인합니다.

## 확인 항목

- 긴 fixture: 경력 3개, 프로젝트 3개, 한 페이지보다 긴 경력 항목, 긴 URL 포함.
- Preview를 끝까지 스크롤하여 모든 본문과 서명이 보이는지 확인.
- 모바일 및 데스크톱에서 URL이 표 너비를 넘지 않는지 확인.
- PDF로 저장: A4, 배율 100%, 브라우저 머리글/바닥글 해제.
- 여러 페이지에 걸쳐 텍스트·표 선이 겹치거나 잘리지 않는지 확인.
- PDF 검색으로 CAREER-1-001, CAREER-1-100, PROJECT-3-020을 확인.
- 프로젝트/GitHub/Portfolio 링크가 PDF에서 클릭 가능한지 확인.
- 빈 fixture: 영문 이름·날짜 예시·주소 예시·GitHub / Portfolio·이력서 사진 문구가 데이터로 출력되지 않는지 확인. 표의 항목명과 빈 사진 공간은 유지됩니다.
- 개발자 도구를 닫은 상태에서도 인쇄 미리보기를 확인합니다. Preview는 연속된 문서이며 화면과 PDF의 페이지 경계가 동일한 것을 보장하지 않습니다.

검증을 마치면 홈으로 이동한 후 Console에서 전용 데이터를 제거할 수 있습니다.

```js
localStorage.removeItem('resume:dockit-output-qa');
```
