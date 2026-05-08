# DocKit

DocKit은 취업 준비 문서를 입력 폼으로 작성하고, 제출용 레이아웃을 실시간으로 확인하는 React 문서 작성 도구입니다.

현재 MVP는 국문 이력서 작성 흐름에 집중했습니다. 사용자는 기본 정보, 학력, 자격증, 경력, 프로젝트, 링크, 스킬을 입력하고 오른쪽 미리보기에서 문서 형태를 바로 확인할 수 있습니다.

## Demo

- 배포 링크: 준비 중
- GitHub 링크: 준비 중

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- localStorage

## Main Features

- 국문 이력서 작성에 필요한 기본 정보, 학력, 자격증, 경력, 프로젝트, 링크, 스킬 섹션 제공
- 입력 영역과 미리보기 영역을 분리해 작성 중 문서 결과를 바로 확인
- 반복 섹션을 추가/삭제할 수 있도록 데이터 구조와 UI 구성
- localStorage를 사용해 새로고침 후에도 작성 중인 내용을 유지
- 작성 중인 내용이 있을 때 이탈 방지 안내 제공
- 모바일과 데스크톱에서 사용할 수 있도록 반응형 레이아웃 구성

## My Role

- React + TypeScript 기반 프로젝트 구조 설계
- 이력서 데이터 타입, 기본값, 저장 로직 구성
- 폼 입력 UI와 실시간 미리보기 UI 구현
- 반응형 레이아웃, label 연결, 버튼 상태 등 기본 접근성 품질 점검

## Problems Solved

- 이력서 섹션별 입력값을 하나의 상태 구조로 관리해 미리보기와 폼이 같은 데이터를 사용하도록 만들었습니다.
- 반복되는 프로젝트, 경력, 링크 입력 UI를 섹션 컴포넌트로 나누어 유지보수하기 쉽게 정리했습니다.
- 작성 중인 내용이 새로고침으로 사라지지 않도록 localStorage 저장/복원 흐름을 추가했습니다.
- 제출용 문서 형태를 따로 확인해야 하는 번거로움을 줄이기 위해 입력 화면 안에서 미리보기를 함께 제공했습니다.

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

## Build

```bash
npm run build
```

## Local Commands

```bash
npm run lint
npm run build
```

## What I Learned

- 문서 작성 흐름을 입력 영역과 미리보기 영역으로 분리하는 방법
- 반복 가능한 이력서 섹션을 타입과 컴포넌트로 관리하는 방법
- localStorage를 사용해 새로고침 후에도 작성 내용을 유지하는 방법
- 폼 label, input type, 반응형 grid 등 기본적인 접근성/퍼블리싱 품질이 포트폴리오 완성도에 미치는 영향

## Future Improvements

- 미리보기 영역 이미지 저장 기능
- 자기소개서, 경력기술서, 프로젝트 보고서 양식 추가
- 모바일에서 입력/미리보기 전환 UX 개선
- 문서 목록과 최근 수정 시간 표시
- 샘플 데이터 불러오기
