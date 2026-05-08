export function formatRelativeTime(ts: number) {
    const diff = Date.now() - ts;
    const sec = Math.floor(diff / 1000);

    if (sec < 10) return "방금 저장됨";
    if (sec < 60) return `${sec}초 전 저장됨`;

    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}분 전 저장됨`;

    const hour = Math.floor(min / 60);
    return `${hour}시간 전 저장됨`;
}
