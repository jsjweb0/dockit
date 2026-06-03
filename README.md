# DocKit

DocKit은 문서양식을 입력 폼으로 작성하고, 제출용 레이아웃을 실시간으로 확인하는 React 문서 작성 도구입니다.

현재 MVP는 국문 이력서 작성 흐름에 집중했습니다. 사용자는 기본 정보, 학력, 자격증, 경력, 프로젝트, 링크, 스킬을 입력하고 오른쪽 미리보기에서 문서 형태를 바로 확인할 수 있습니다.

현재는 샘플 데이터 불러오기, 최근 작성중 목록, 이미지 저장, 접근성 개선이 반영된 상태입니다.

## Demo

- 배포 링크: https://dockit.jsjweb0.workers.dev/
- GitHub 링크: https://github.com/jsjweb0/dockit
- 배포 환경: Cloudflare Workers

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- localStorage
- Radix UI
- Cloudflare Workers

## Main Features

- 국문 이력서 작성에 필요한 기본 정보, 학력, 자격증, 경력, 프로젝트, 링크, 스킬 섹션 제공
- 입력 영역과 미리보기 영역을 분리해 작성 중 문서 결과를 바로 확인
- 반복 섹션을 추가/삭제할 수 있도록 데이터 구조와 UI 구성
- localStorage를 사용해 저장한 이력서를 최근 작성중 목록에서 다시 열 수 있도록 구성
- 작성 중인 내용이 있을 때 이탈 방지 안내 제공
- 예시 불러오기 버튼으로 샘플 이력서 데이터를 폼과 미리보기에 즉시 반영
- 미리보기 영역을 이미지로 저장할 수 있는 내보내기 기능 제공
- 오류가 있는 탭을 선택하면 첫 번째 오류 입력 필드로 포커스 이동
- AlertDialog 닫힘 후 포커스 복귀 흐름을 정리해 키보드 사용성 개선
- 모바일과 데스크톱에서 사용할 수 있도록 반응형 레이아웃 구성

## My Role

- React + TypeScript 기반 프로젝트 구조 설계
- 이력서 데이터 타입, 기본값, 저장 로직 구성
- 폼 입력 UI와 실시간 미리보기 UI 구현
- 반응형 레이아웃, label 연결, 버튼 상태, 다이얼로그 포커스 등 접근성 품질 점검
- Cloudflare Workers 기반 정적 배포 설정 구성

## Problems Solved

- 이력서 섹션별 입력값을 하나의 상태 구조로 관리해 미리보기와 폼이 같은 데이터를 사용하도록 만들었습니다.
- 반복되는 프로젝트, 경력, 링크 입력 UI를 섹션 컴포넌트로 나누어 유지보수하기 쉽게 정리했습니다.
- 작성 중인 이력서를 저장하면 메인 화면의 최근 작성중 목록에서 다시 열 수 있도록 localStorage 저장/복원 흐름을 추가했습니다.
- 제출용 문서 형태를 따로 확인해야 하는 번거로움을 줄이기 위해 입력 화면 안에서 미리보기를 함께 제공했습니다.
- 드롭다운 안에서 confirm dialog를 직접 여는 구조를 정리해 닫힘 후 포커스가 사라지는 문제를 줄였습니다.
- 샘플 데이터를 별도 모델 파일로 분리해 예시 불러오기 기능을 유지보수하기 쉽게 구성했습니다.

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
npm run build
npm run deploy
```

## What I Learned

- 반복 가능한 이력서 섹션을 타입과 컴포넌트로 관리하는 방법
- localStorage를 사용해 작성중 문서 목록과 개별 문서 데이터를 관리하는 방법
- 폼 label, input type, 포커스 이동, dialog focus, 반응형 grid 등 기본적인 접근성/퍼블리싱 품질이 포트폴리오 완성도에 미치는 영향
- Vite 정적 빌드 결과물을 Cloudflare Workers Assets로 배포하는 흐름

## Future Improvements

- PDF 저장 기능
- 자기소개서, 경력기술서, 프로젝트 보고서 양식 추가
- 미리보기 이미지 저장 품질 개선
- 모바일에서 입력/미리보기 전환 UX 추가 개선
