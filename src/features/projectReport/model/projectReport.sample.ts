import type { ProjectReport } from './projectReport.types';

export function sampleProjectReport(): ProjectReport {
  return {
    meta: { version: 1 },
    title: 'DocKit 국문 제출 문서 작성 도구',
    summary:
      '한글·Word에서 복잡한 표 양식을 직접 편집해야 하는 불편을 줄이기 위해, 입력 내용을 A4 제출용 문서로 실시간 미리 볼 수 있게 만든 React 기반 문서 작성 도구입니다.',
    role: '1인 개발 · 기획, UI 퍼블리싱, 프론트엔드, 배포',
    period: '2026.04 ~ 2026.08',
    techStack:
      'React 19, TypeScript, Vite, React Router, Tailwind CSS, Radix UI, Vitest, Cloudflare Workers',
    keyFeatures:
      '이력서·자기소개서·경력기술서 문서별 입력 폼 제공\n' +
      '입력 내용을 A4 제출 양식에 실시간으로 반영\n' +
      '문서별 필드 검증과 첫 오류 위치 포커스 이동\n' +
      'localStorage 저장·복원과 60초 자동 저장\n' +
      'window.print와 인쇄 전용 CSS를 이용한 PDF 출력',
    problem:
      '문서 종류가 늘어나면서 새 편집 화면을 추가할 때마다 저장, 검증, PDF, 헤더 상태까지 중앙 설정에 먼저 맞춰야 했습니다. 이로 인해 Form과 Preview만 먼저 구현해 화면을 확인하기 어렵고, 문서별로 다른 검증 복잡도에도 같은 구조를 강제하는 문제가 있었습니다.',
    solution:
      '각 BuilderPage가 문서별 Provider, 검증 hook, Header action, Form, Preview를 직접 조립하도록 구조를 변경했습니다. 반복되는 저장·자동 저장·PDF 상태는 useDocumentEditorCore로, localStorage 저장 규칙은 createDocumentStorage로 분리했습니다. 헤더 action은 선택적으로 전달하게 해 저장·검증이 없는 문서도 기본 상태, Form, Preview만으로 화면을 먼저 구현할 수 있게 했습니다.',
    outcome:
      '새 문서의 기본 편집 화면을 추가할 때 필요한 중앙 수정 지점을 Router로 줄였습니다. 문서별 저장과 검증 정책은 각 feature 내부에 명시적으로 남기고, 실제로 반복되는 편집 흐름만 공통화해 문서 추가와 기존 기능 유지보수의 범위를 구분했습니다.',
    responsiveAccessibility:
      '모바일에서는 Form과 Preview를 전환하고, 데스크톱에서는 두 영역을 함께 확인하도록 배치했습니다. label과 input을 연결하고, 오류 상태에 aria-invalid와 aria-describedby를 적용했습니다. 탭 전환 시 첫 오류 필드로 포커스를 이동하고, 다이얼로그 종료 후 포커스 복귀와 prefers-reduced-motion을 고려했습니다.',
    githubUrl: 'https://github.com/jsjweb0/dockit',
    demoUrl: 'https://dockit.jsjweb0.workers.dev/',
  };
}
