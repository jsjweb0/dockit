# DocKit

DocKit은 문서 양식을 입력 폼으로 작성하고, 제출용 레이아웃을 실시간으로 확인하는 React 문서 작성 도구입니다.

현재 MVP는 국문 이력서 작성 흐름에 집중했습니다. 사용자는 기본 정보, 학력, 자격증, 경력, 프로젝트, 링크, 스킬을 입력하고 오른쪽 미리보기에서 문서 형태를 바로 확인할 수 있습니다.

현재는 샘플 데이터 불러오기, 최근 작성중 목록, 텍스트형 PDF 저장, 이미지 저장, 접근성 개선이 반영된 상태입니다.
입력값 검증 로직과 저장 시간 표시 로직에는 Vitest 단위 테스트를 추가해 주요 경계값과 오류 메시지를 확인했습니다.

## Demo

- 배포 링크: [https://dockit.jsjweb0.workers.dev/](https://dockit.jsjweb0.workers.dev/)
- GitHub 링크: [https://github.com/jsjweb0/dockit](https://github.com/jsjweb0/dockit)
- 배포 환경: Cloudflare Workers

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- localStorage
- Radix UI
- Vitest
- Cloudflare Workers

## Main Features

- 국문 이력서 작성에 필요한 기본 정보, 학력, 자격증, 경력, 프로젝트, 링크, 스킬 섹션 제공
- 입력 영역과 미리보기 영역을 분리해 작성 중 문서 결과를 바로 확인
- 반복 섹션을 추가/삭제할 수 있도록 데이터 구조와 UI 구성
- localStorage를 사용해 저장한 이력서를 최근 작성중 목록에서 다시 열 수 있도록 구성
- 작성 중인 내용이 있을 때 이탈 방지 안내 제공
- 예시 불러오기 버튼으로 샘플 이력서 데이터를 폼과 미리보기에 즉시 반영
- 브라우저 인쇄 기능과 `@media print` 스타일을 활용해 텍스트 선택 가능한 PDF 저장 흐름 제공
- 미리보기 영역을 이미지로 저장할 수 있는 내보내기 기능 제공
- 오류가 있는 탭을 선택하면 첫 번째 오류 입력 필드로 포커스 이동
- 기본 정보와 선택 섹션 입력값을 검증하고, 빈 값/공백/잘못된 형식에 맞는 오류 메시지 제공
- Vitest 단위 테스트로 저장 시간 표시, 기본 정보 검증, 선택 섹션 검증 로직의 주요 케이스 확인
- AlertDialog 닫힘 후 포커스 복귀 흐름을 정리해 키보드 사용성 개선
- 모바일과 데스크톱에서 사용할 수 있도록 반응형 레이아웃 구성

## My Role

- React + TypeScript 기반 프로젝트 구조 설계
- 이력서 데이터 타입, 기본값, 저장 로직 구성
- 폼 입력 UI와 실시간 미리보기 UI 구현
- 반응형 레이아웃, label 연결, 버튼 상태, 다이얼로그 포커스 등 접근성 품질 점검
- Cloudflare Workers 기반 정적 배포 설정 구성
- Vitest 기반 단위 테스트를 추가해 저장 시간 표시와 이력서 검증 로직의 주요 케이스 검증

## Problems Solved

- 이력서 섹션별 입력값을 하나의 상태 구조로 관리해 미리보기와 폼이 같은 데이터를 사용하도록 만들었습니다.
- 반복되는 프로젝트, 경력, 링크 입력 UI를 섹션 컴포넌트로 나누어 유지보수하기 쉽게 정리했습니다.
- 작성 중인 이력서를 저장하면 메인 화면의 최근 작성중 목록에서 다시 열 수 있도록 localStorage 저장/복원 흐름을 추가했습니다.
- 제출용 문서 형태를 따로 확인해야 하는 번거로움을 줄이기 위해 입력 화면 안에서 미리보기를 함께 제공했습니다.
- 드롭다운 안에서 confirm dialog를 직접 여는 구조를 정리해 닫힘 후 포커스가 사라지는 문제를 줄였습니다.
- 샘플 데이터를 별도 모델 파일로 분리해 예시 불러오기 기능을 유지보수하기 쉽게 구성했습니다.
- 이력서 기본 정보와 선택 섹션 검증 로직을 순수 함수로 분리하고, 빈 값, 공백 값, 잘못된 URL, 휴대폰/이메일 형식, 현재 재직 중 종료일 예외 같은 케이스를 단위 테스트로 확인했습니다.
- 이미지 캡처 기반 PDF 저장은 텍스트 선택과 검색이 불가능하다는 한계가 있어, 브라우저 인쇄 기능과 `@media print` 스타일을 활용하는 방식으로 정리했습니다. 이를 통해 사용자가 저장한 PDF에서도 텍스트 선택, 복사, 검색이 가능하도록 했습니다.
- Safari에서 table `rowSpan` 높이가 섹션 추가/삭제 후 즉시 재계산되지 않는 이슈를 확인하고, 미리보기 table을 재마운트해 레이아웃 깨짐을 방지했습니다. preview 영역은 읽기 전용으로 구성했으며, 추후 CSS grid 기반 레이아웃으로 개선할 예정입니다.

## Folder Structure

```text
src
├── components
│   ├── layout
│   └── ui
├── features
│   ├── documents
│   └── resume
│       ├── context
│       ├── model
│       └── ui
├── layout
├── pages
└── utils
```

## Installation

```bash
npm install
npm run dev
```

개발 서버 실행 후 브라우저에서 `http://localhost:5173`으로 확인할 수 있습니다.

## Build

```bash
npm run build
```

## Test

```bash
npm run test:run
```

Vitest를 사용해 순수 유틸 함수와 이력서 검증 로직을 테스트합니다.

- `formatRelativeTime`: 초, 분, 시간, 24시간 이후 일 단위 표시
- `validateBasics`: 이름, 연락처, 이메일, 지원부문 필수값과 형식 검증
- `validateOptionalSections`: 학력, 자격증, 경력, 프로젝트, 링크 섹션의 선택 입력 검증

## Cloudflare Deployment

이 프로젝트는 Vite 빌드 결과물인 `dist` 폴더를 Cloudflare Workers Assets로 배포합니다.

배포 설정은 `wrangler.jsonc`에서 관리합니다.

```jsonc
{
  "name": "dockit",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "single-page-application"
  }
}
```

배포 전 빌드와 Cloudflare 배포를 한 번에 실행합니다.

```bash
npm run deploy
```

`npm run deploy`는 내부적으로 `npm run build`를 실행한 뒤 `wrangler deploy`로 `dist` 폴더를 Cloudflare Workers Assets에 배포합니다.

처음 배포하거나 새 환경에서 배포할 때는 Cloudflare 로그인이 필요합니다.

```bash
npx wrangler login
```

React Router를 사용하는 SPA이므로 `not_found_handling`을 `single-page-application`으로 설정해 새로고침이나 직접 URL 접근 시에도 앱이 정상적으로 열리도록 했습니다.

## Local Commands

```bash
npm run lint
npm run test:run
npm run build
npm run deploy
```

## What I Learned

- 반복 가능한 이력서 섹션을 타입과 컴포넌트로 관리하는 방법
- localStorage를 사용해 작성중 문서 목록과 개별 문서 데이터를 관리하는 방법
- 폼 label, input type, 포커스 이동, dialog focus, 반응형 grid 등 기본적인 접근성/퍼블리싱 품질이 포트폴리오 완성도에 미치는 영향
- 입력값 검증 로직을 순수 함수로 분리하면 UI와 별개로 빈 값, 공백, 잘못된 형식, 경계값을 단위 테스트하기 쉽다는 점
- 문서형 서비스에서는 이미지 캡처 방식보다 print CSS 기반 출력이 텍스트 검색과 복사 가능성 측면에서 더 적합할 수 있다는 점
- Vite 정적 빌드 결과물을 Cloudflare Workers Assets로 배포하는 흐름

## Future Improvements

- 초기 번들 최적화
- 인쇄 전 안내 문구와 브라우저별 PDF 저장 UX 개선
- 자기소개서, 경력기술서, 프로젝트 보고서 양식 추가
- 미리보기 문서 레이아웃을 table 기반 구조에서 CSS grid 기반 구조로 개선

