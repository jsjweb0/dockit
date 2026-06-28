import type { Resume } from '../model/resume.types';
import { formatApplicationType } from '../model/resume.types';

type Props = { value: Resume };

const PREVIEW_ROW_COUNT = 3;

function fillRows<T>(rows: T[], createEmptyRow: (index: number) => T) {
  if (rows.length >= PREVIEW_ROW_COUNT) {
    return rows;
  }

  return [
    ...rows,
    ...Array.from({ length: PREVIEW_ROW_COUNT - rows.length },
      (_, index) => createEmptyRow(index),
    ),
  ];
}

function toPreviewOrder<T>(rows: T[]) {
  return [...rows].reverse();
}

function hasAnyValue<T extends Record<string, unknown>>(
  row: T,
  keys: Array<keyof T>,
) {
  return keys.some((key) => Boolean(row[key]));
}

function formatPeriod(start?: string, end?: string, isCurrent?: boolean) {
  if (!start && !end && !isCurrent) return '-';
  return `${start || '시작'} - ${isCurrent ? '재직중' : end || '종료'}`;
}

function KoreanDate({ value }: { value?: string }) {
  if (!value) {
    return (
      <>
        <span>년</span> <span>월</span> <span>일</span>
      </>
    );
  }

  const [year, month, day] = value.split('-');
  return (
    <>
      <span>{year}년</span>
      <span>{month}월</span>
      <span>{day}일</span>
    </>
  );
}

export function ResumePreview({ value }: Props) {
  const b = value.basics;
  const educationRows = fillRows(
    toPreviewOrder(value.education).filter((row) =>
      hasAnyValue(row, ['period', 'institution', 'major']),
    ),
    (index) => ({
      id: `empty-education-${index}`,
      period: '',
      institution: '',
      major: '',
    }),
  );
  const certificationRows = fillRows(
    toPreviewOrder(value.certifications).filter((row) =>
      hasAnyValue(row, ['acquiredAt', 'name', 'issuer']),
    ),
    (index) => ({
      id: `empty-certification-${index}`,
      acquiredAt: '',
      name: '',
      issuer: '',
    }),
  );
  const experienceRows = fillRows(
    toPreviewOrder(value.experience).filter((row) =>
      hasAnyValue(row, ['company', 'role', 'start', 'end', 'description']),
    ),
    (index) => ({
      id: `empty-experience-${index}`,
      company: '',
      role: '',
      start: '',
      isCurrent: false,
      end: '',
      description: '',
    }),
  );
  const projectRows = fillRows(
    toPreviewOrder(value.projects).filter((row) =>
      hasAnyValue(row, ['name', 'period', 'stack', 'description', 'link']),
    ),
    (index) => ({
      id: `empty-project-${index}`,
      name: '',
      period: '',
      stack: '',
      description: '',
      link: '',
    }),
  );

  return (
    <div className="resumeDocument">
      <div className="grid grid-cols-2 items-center gap-6 mb-3">
        <h2 className="flex justify-center gap-6 text-[28px] font-extrabold leading-none">
          <span>이</span>
          <span>력</span>
          <span>서</span>
        </h2>
        <table className="docTable mb-0">
          <caption className="sr-only">지원 정보</caption>
          <tbody>
            <tr>
              <th scope="row">지원구분</th>
              <td>{formatApplicationType(b.applicationType)}</td>
            </tr>
            <tr>
              <th scope="row">지원부문</th>
              <td>{b.title || '프론트엔드 개발자'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <table className="docTable">
        <caption className="sr-only">인적사항</caption>
        <tbody>
          <tr>
            <td colSpan={3} rowSpan={4} className="docTable__photo">
              이력서 사진
            </td>
            <th scope="row" colSpan={2}>
              성 명
            </th>
            <td colSpan={3}>{b.name || '이름'}</td>
            <th scope="row" colSpan={2}>
              영 문
            </th>
            <td colSpan={3}>{b.nameEn || '영문 이름'}</td>
          </tr>
          <tr>
            <th scope="row" colSpan={2}>
              생년월일
            </th>
            <td colSpan={3}>{b.birth || 'YYYY.MM.DD'}</td>
            <th scope="row" colSpan={2}>
              연락처
            </th>
            <td colSpan={3}>{b.phone || '010-0000-0000'}</td>
          </tr>
          <tr>
            <th scope="row" colSpan={2}>
              주소
            </th>
            <td colSpan={8}>{b.address || '주소'}</td>
          </tr>
          <tr>
            <th scope="row" colSpan={2}>
              이메일
            </th>
            <td colSpan={8}>{b.email || 'email@example.com'}</td>
          </tr>
        </tbody>
      </table>

      <table className="docTable">
        <caption className="sr-only">학력사항</caption>
        <tbody>
          <tr>
            <th
              scope="rowgroup"
              colSpan={2}
              rowSpan={educationRows.length + 1}
              className="docTable__rowGroup"
            >
              학
              <br />력
              <br />사
              <br />항
            </th>
            <th scope="col" colSpan={9}>
              기간
            </th>
            <th scope="col" colSpan={9}>
              출신학교
            </th>
            <th scope="col" colSpan={7}>
              학과(전공)
            </th>
          </tr>
          {educationRows.map((e, index) => (
            <tr key={e.id}>
              <td colSpan={9}>
                {e.period || (index === 0 && '')}
              </td>
              <td colSpan={9}>{e.institution || (index === 0 && '')}</td>
              <td colSpan={7}>{e.major || (index === 0 && '')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <table className="docTable"
        key={value.certifications.map((item) => item.id).join('|')}
      >
        <caption className="sr-only">자격증</caption>
        <tbody>
          <tr>
            <th
              scope="rowgroup"
              colSpan={2}
              rowSpan={certificationRows.length + 1}
              className="docTable__rowGroup"
            >
              자
              <br />격
              <br />증
            </th>
            <th scope="col" colSpan={7}>
              취득일
            </th>
            <th scope="col" colSpan={10}>
              자격증명
            </th>
            <th scope="col" colSpan={8}>
              발행처
            </th>
          </tr>
          {certificationRows.map((cert, index) => (
            <tr key={cert.id}>
              <td colSpan={7}>
                {cert.acquiredAt || (index === 0 && '')}
              </td>
              <td colSpan={10}>{cert.name || (index === 0 && '')}</td>
              <td colSpan={8}>{cert.issuer || (index === 0 && '')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <table className="docTable"
        key={value.experience.map((item) => item.id).join('|')}
      >
        <caption className="sr-only">경력사항</caption>
        <tbody>
          <tr>
            <th
              scope="rowgroup"
              colSpan={2}
              rowSpan={experienceRows.length + 1}
              className="docTable__rowGroup"
            >
              경
              <br />력
              <br />사
              <br />항
            </th>
            <th scope="col" colSpan={7}>
              근무기간
            </th>
            <th scope="col" colSpan={6}>
              회사명
            </th>
            <th scope="col" colSpan={3}>
              직위
            </th>
            <th scope="col" colSpan={9}>
              담당업무
            </th>
          </tr>
          {experienceRows.map((career, index) => (
            <tr key={career.id}>
              <td colSpan={7}>
                {career.company || career.start || career.end
                  ? formatPeriod(career.start, career.end, career.isCurrent)
                  : index === 0 && ''}
              </td>
              <td colSpan={6}>{career.company || (index === 0 && '')}</td>
              <td colSpan={3} className="docTable__center">
                {career.role || (index === 0 && '')}
              </td>
              <td colSpan={9} className="docTable__multiline">
                <div className="docTable__multilineText">
                  {career.description || ''}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <table className="docTable"
        key={value.projects.map((item) => item.id).join('|')}
      >
        <caption className="sr-only">프로젝트</caption>
        <tbody>
          <tr>
            <th
              scope="rowgroup"
              colSpan={2}
              rowSpan={projectRows.length + 1}
              className="docTable__rowGroup"
            >
              프
              <br />로
              <br />젝
              <br />트
            </th>
            <th scope="col" colSpan={7}>
              기간
            </th>
            <th scope="col" colSpan={5}>
              프로젝트명
            </th>
            <th scope="col" colSpan={5}>
              기술
            </th>
            <th scope="col" colSpan={8}>
              주요내용
            </th>
          </tr>
          {projectRows.map((project, index) => (
            <tr key={project.id}>
              <td colSpan={7}>
                {project.period || (index === 0 && '')}
              </td>
              <td colSpan={5}>{project.name || (index === 0 && '')}</td>
              <td colSpan={5} className="docTable__multiline">
                <div className="docTable__multilineText">
                  {project.stack || (index === 0 && '')}
                </div>
              </td>
              <td colSpan={8} className="docTable__multiline">
                <div className="docTable__multilineText">
                  {project.description || ''}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <table className="docTable">
        <caption className="sr-only">핵심 스킬 및 링크</caption>
        <tbody>
          <tr>
            <th scope="row" colSpan={4}>
              핵심 스킬
            </th>
            <td colSpan={9} className="docTable__multiline">
              <div className="docTable__multilineText">
                {[value.skills.primary, ...value.skills.tools].join(', ') || ''}
              </div>
            </td>
            <th scope="row" colSpan={4}>
              링크
            </th>
            <td colSpan={10}>
              {toPreviewOrder(value.links)
                .filter((link) => link.url)
                .map((link) => `${link.label || 'Link'}: ${link.url}`)
                .join(' / ') || 'GitHub / Portfolio'}
            </td>
          </tr>
        </tbody>
      </table>

      {b.summary && (
        <table className="docTable">
          <caption className="sr-only">간단 소개</caption>
          <tbody>
            <tr>
              <th scope="row" colSpan={3}>간단 소개</th>
              <td colSpan={10} className="docTable__multiline">
                <div className="docTable__multilineText">
                  {b.summary}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      )}

      <div className="resumeDocument__sign flex flex-col gap-4.5 mt-7.5 text-center text-sm">
        <p>상기 내용은 사실과 다름없음을 확인합니다.</p>
        <p className="flex justify-center gap-4">
          <KoreanDate value={b.submittedAt} />
        </p>
        <p className="text-right">
          작성자 : <span className="inline-block min-w-20 text-center">{b.name || ''}</span> (인)
        </p>
      </div>
    </div>
  );
}
