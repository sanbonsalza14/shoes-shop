import { useEffect, useMemo, useState } from "react";

const REVIEW_URL = "https://zzzmini.github.io/js/shoesReview.json";
const LS_KEY = "reviews_v1";

// 별
function Stars({ point }) {
  const p = Math.max(0, Math.min(5, Math.round(point || 0)));
  return <span>{"★".repeat(p)}{"☆".repeat(5 - p)}</span>;
}

// 별점 입력
function StarInput({ value, onChange }) {
  return (
    <div>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="btn btn-link p-0 me-1"
          style={{ textDecoration: "none" }}
          aria-label={`${n}점`}
        >
          <span style={{ fontSize: 20 }}>{n <= value ? "★" : "☆"}</span>
        </button>
      ))}
      <span className="ms-1">{value} / 5</span>
    </div>
  );
}

// 로컬스토리지 I/O
const readLocalAll = () => {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); }
  catch { return []; }
};
const writeLocalAll = (list) => localStorage.setItem(LS_KEY, JSON.stringify(list));

export default function ReviewTab({ productId }) {
  // 원격 전체
  const [remoteAll, setRemoteAll] = useState([]);
  // 이 상품의 로컬 리뷰
  const [localMine, setLocalMine] = useState([]);
  // ✅ 로컬 변경 버전 (의존성용)
  const [localVer, setLocalVer] = useState(0);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // 보기 옵션
  const [filterAll, setFilterAll] = useState(false); // 전체 리뷰 보기
  const [showAll, setShowAll] = useState(false);     // 더보기

  // 작성 폼
  const [openForm, setOpenForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [point, setPoint] = useState(5);

  // 원격 읽기
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr(null);

    fetch(REVIEW_URL, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => { if (alive) setRemoteAll(Array.isArray(data) ? data : []); })
      .catch((e) => setErr(e.message || "fetch error"))
      .finally(() => alive && setLoading(false));

    return () => { alive = false; };
  }, []);

  // 이 상품의 로컬 리뷰 로드 (상품/로컬버전 바뀔 때마다)
  useEffect(() => {
    const all = readLocalAll();
    setLocalMine(all.filter((r) => r.productId === productId));
  }, [productId, localVer]); // ✅ localVer 추가

  // ✅ 병합 리스트 (로컬 변화에 반응하도록 localMine, localVer 의존)
  const merged = useMemo(() => {
    const localsAll = readLocalAll(); // localVer 바뀌면 재평가됨
    const remoteScoped = filterAll
      ? remoteAll
      : remoteAll.filter((r) => r.productId === productId);
    const localScoped = filterAll ? localsAll : localMine;

    return [...remoteScoped, ...localScoped].sort(
      (a, b) => Number(b.reviewId) - Number(a.reviewId)
    );
  }, [remoteAll, localMine, filterAll, productId, localVer]); // ✅ 의존성 보강

  // 평균
  const average = useMemo(() => {
    if (merged.length === 0) return 0;
    const sum = merged.reduce((acc, cur) => acc + Number(cur.point || 0), 0);
    return Math.round((sum / merged.length) * 10) / 10;
  }, [merged]);

  const visible = showAll ? merged : merged.slice(0, 3);

  // 폼 제출
  const submit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해 주세요.");
      return;
    }
    const newReview = {
      reviewId: Date.now(),   // 임시 ID
      productId,
      point: Number(point),
      title: title.trim(),
      review: content.trim(),
    };

    // 로컬 저장 + 상태 갱신
    const all = readLocalAll();
    all.push(newReview);
    writeLocalAll(all);

    setLocalMine((prev) => [newReview, ...prev]); // 이 상품 리스트 즉시 반영
    setLocalVer((v) => v + 1);                    // ✅ 병합 useMemo 재계산 트리거

    // 초기화
    setTitle(""); setContent(""); setPoint(5);
    setOpenForm(false);
    setShowAll(true);
  };

  if (loading) return <div className="section-card mt-3">리뷰 로딩 중…</div>;
  if (err) return <div className="section-card mt-3 text-danger">리뷰 불러오기 실패: {err}</div>;

  return (
    <div className="section-card mt-3">
      {/* 헤더 */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
        <div className="d-flex align-items-end gap-2">
          <h5 className="mb-0">리뷰 ({merged.length})</h5>
          <div className="text-muted"><Stars point={average} /> <small>평균 {average}</small></div>
        </div>

        <div className="d-flex align-items-center gap-3">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="filterAll"
              checked={filterAll}
              onChange={(e) => setFilterAll(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="filterAll">전체 리뷰 보기</label>
          </div>

          <button className="btn btn-primary btn-sm" type="button" onClick={() => setOpenForm((v) => !v)}>
            {openForm ? "작성 닫기" : "리뷰 작성하기"}
          </button>
        </div>
      </div>

      {/* 작성 폼 */}
      {openForm && (
        <form className="mt-3" onSubmit={submit}>
          <div className="mb-2">
            <label className="form-label">별점</label>
            <StarInput value={point} onChange={setPoint} />
          </div>
          <div className="mb-2">
            <label className="form-label">제목</label>
            <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목을 입력하세요" />
          </div>
          <div className="mb-2">
            <label className="form-label">내용</label>
            <textarea className="form-control" rows={3} value={content} onChange={(e) => setContent(e.target.value)} placeholder="리뷰 내용을 입력하세요" />
          </div>
          <div className="text-end">
            <button className="btn btn-secondary me-2" type="button" onClick={() => setOpenForm(false)}>취소</button>
            <button className="btn btn-success" type="submit">등록</button>
          </div>
          <hr />
        </form>
      )}

      {/* 리스트 */}
      {visible.length === 0 && <p className="text-muted mb-0">아직 등록된 리뷰가 없습니다.</p>}

      {visible.map((r) => (
        <div key={r.reviewId} className="mb-3">
          <div className="d-flex align-items-center gap-2">
            <strong><Stars point={r.point} /></strong>
            <span className="fw-semibold">{r.title}</span>
            {filterAll && <span className="badge text-bg-light ms-2">productId: {r.productId}</span>}
          </div>
          <p className="mb-1">{r.review}</p>
          <small className="text-muted">리뷰 ID: {r.reviewId}</small>
          <hr className="mt-3" />
        </div>
      ))}

      {/* 더보기/접기 */}
      {merged.length > 3 && (
        <div className="text-center">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => setShowAll((v) => !v)}
          >
            {showAll ? "접기" : "더보기"}
          </button>
        </div>
      )}
    </div>
  );
}
