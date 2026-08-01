import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeftIcon,
  CalendarIcon,
  NewspaperIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { Helmet } from "react-helmet-async";



const apiBaseUrl = `${process.env.PUBLIC_URL || ""}/api`;

interface NewsItem {
  id: number;
  t: {
    ko: string;
  };
  c: {
    ko: string;
  };
  d: string;
  g: string;
}

const NewsWebView: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<string>("all");

  useEffect(() => {
    setLoading(true);

    fetch(`${apiBaseUrl}/news.json`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("news.json not found");
        }
        return res.json();
      })
      .then((data) => {
        const list = Array.isArray(data?.newsList) ? data.newsList : [];
        setNewsList(list as NewsItem[]);

        if (id) {
          const item = list.find(
            (item: NewsItem) => item.id === parseInt(id, 10)
          );
          item ? setNewsItem(item) : setError("News item not found");
        }
      })
      .catch(() => {
        setNewsList([]);
        setNewsItem(null);
        setError("News data could not be loaded");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const filteredNewsList =
    selectedGame === "all"
      ? newsList
      : newsList.filter((item) =>
          selectedGame === "LiteStars"
            ? item.g === "LiteStars"
            : item.g !== "LiteStars"
        );

  const handleBack = () => {
    if (id) {
      navigate(`/LiteStars/webview/News`);
      return;
    }

    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate(`/LiteStars/webview/News`);
    }
  };

  function handleExit() {
    if (window.Unity) {
      window.Unity.call("close");
    } else {
      window.open("https://litestar.pages.dev/", "_self");
    }
  }

  // 1. 로딩 화면 (패딩 최적화)
  if (loading) {
    return (
      <>
        <Helmet>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
          />
        </Helmet>
        <main className="h-screen w-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.22),_transparent_40%),linear-gradient(135deg,_#020617_0%,_#0f172a_45%,_#111827_100%)] p-4 text-slate-100 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-cyan-400/20 bg-slate-900/80 p-6 shadow-lg">
            <div className="mb-3 h-10 w-10 animate-spin rounded-full border-4 border-cyan-400/30 border-t-cyan-400"></div>
            <p className="text-base font-semibold text-slate-100">소식을 불러오는 중...</p>
          </div>
        </main>
      </>
    );
  }

  // 2. 뉴스 상세 페이지
  if (id && newsItem) {
    return (
      <>
        <Helmet>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
          />
        </Helmet>
        <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.22),_transparent_40%),linear-gradient(135deg,_#020617_0%,_#0f172a_45%,_#111827_100%)] px-3 py-3 text-slate-100">
          <div className="mx-auto max-w-4xl">
            {/* 상단 버튼 바 */}
            <div className="mb-3 flex items-center justify-between">
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/20 bg-slate-900/80 px-3 py-1.5 text-xs font-bold text-slate-200 transition-all active:scale-95"
              >
                <ArrowLeftIcon className="h-3.5 w-3.5" />
                목록으로
              </button>

              <button
                onClick={handleExit}
                className="inline-flex items-center gap-1 rounded-full border border-rose-400/30 bg-rose-500/20 px-3 py-1.5 text-xs font-bold text-rose-200 active:scale-95"
              >
                <XMarkIcon className="h-3.5 w-3.5" />
                닫기
              </button>
            </div>

            <article className="overflow-hidden rounded-2xl border border-cyan-400/20 bg-slate-900/90 shadow-xl">
              <div className="bg-gradient-to-r from-fuchsia-600 via-indigo-600 to-cyan-500 p-4 sm:p-6">
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-full bg-black/30 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                    {newsItem.g === "LiteStars" ? "LiteStars" : "GENERAL"}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-white/90">
                    <CalendarIcon className="h-3.5 w-3.5" />
                    {newsItem.d}
                  </span>
                </div>
                <h1 className="text-lg sm:text-2xl font-black leading-snug text-white">
                  {newsItem.t.ko}
                </h1>
              </div>

              <div className="p-4 sm:p-6">
                <div className="rounded-xl border border-cyan-400/10 bg-slate-950/70 p-4">
                  <p className="whitespace-pre-line text-sm sm:text-base leading-relaxed text-slate-200">
                    {newsItem.c.ko.replace(/\\n/g, "\n")}
                  </p>
                </div>
              </div>
            </article>
          </div>
        </main>
      </>
    );
  }

  // 3. 뉴스 리스트 메인 페이지
  return (
    <>
      <Helmet>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Helmet>
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.22),_transparent_40%),linear-gradient(135deg,_#020617_0%,_#0f172a_45%,_#111827_100%)] px-3 py-3 text-slate-100">
        <div className="mx-auto max-w-5xl">
          {/* 상단 나가기 버튼 전용 바 */}
          <div className="mb-2 flex justify-end">
            <button
              onClick={handleExit}
              className="inline-flex items-center gap-1 rounded-full border border-rose-400/30 bg-rose-500/20 px-3 py-1 text-xs font-bold text-rose-200 transition-all active:scale-95"
            >
              <XMarkIcon className="h-3.5 w-3.5" />
              나가기
            </button>
          </div>

          {/* 헤더 섹션 (높이 및 여백 축소) */}
          <div className="mb-4 rounded-2xl border border-cyan-400/20 bg-slate-900/80 p-4 text-center shadow-lg">
            <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 shadow-md">
              <NewspaperIcon className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white">
              News & <span className="text-indigo-300">Updates</span>
            </h1>
          </div>

          {/* 카테고리 필터 버튼 */}
          <div className="mb-4 flex flex-wrap justify-center gap-1.5">
            {[
              { id: "all", label: "전체 소식", color: "bg-indigo-600" },
              { id: "LiteStars", label: "LiteStars", color: "bg-fuchsia-600" },
              { id: "general", label: "공지사항", color: "bg-slate-700" },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setSelectedGame(btn.id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-all active:scale-95 ${
                  selectedGame === btn.id
                    ? `${btn.color} text-white border-transparent shadow`
                    : "border-cyan-400/20 bg-slate-900/70 text-slate-300 active:bg-slate-800"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* 뉴스 카드 그리드 (모바일 1열 / 태블릿 이상 2~3열) */}
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredNewsList.map((item) => (
              <Link
                key={item.id}
                to={`/LiteStars/webview/News?id=${item.id}`}
                className="group relative flex flex-col justify-between rounded-xl border border-cyan-400/20 bg-slate-900/80 p-3.5 shadow transition-all active:scale-[0.98]"
              >
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        item.g === "LiteStars"
                          ? "bg-fuchsia-500/20 text-fuchsia-300"
                          : "bg-indigo-500/20 text-indigo-300"
                      }`}
                    >
                      {item.g === "LiteStars" ? "LiteStars" : "공지"}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <CalendarIcon className="h-3 w-3" />
                      {item.d}
                    </span>
                  </div>

                  <h3 className="line-clamp-2 text-sm font-bold leading-snug text-white group-hover:text-indigo-300">
                    {item.t.ko}
                  </h3>
                </div>

                <div className="mt-3 flex items-center justify-end text-xs font-bold text-indigo-400">
                  <span>자세히 보기</span>
                  <ChevronRightIcon className="h-3.5 w-3.5 ml-0.5" />
                </div>
              </Link>
            ))}
          </div>

          {filteredNewsList.length === 0 && (
            <div className="mt-4 rounded-xl border border-cyan-400/20 bg-slate-900/70 py-10 text-center">
              <p className="text-xs text-slate-400">등록된 뉴스가 없습니다.</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default NewsWebView;