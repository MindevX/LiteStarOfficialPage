import React, { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  CalendarIcon,
  NewspaperIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";

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
        // "open_url:https://news.site.com" 메시지 전송
        window.Unity.call("close");
    } else {
        window.open("https://litestar.pages.dev/", '_self');
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.22),_transparent_40%),linear-gradient(135deg,_#020617_0%,_#0f172a_45%,_#111827_100%)] px-4 py-8 text-slate-100">
        <div className="mx-auto flex min-h-[70vh] max-w-5xl flex-col items-center justify-center rounded-[2rem] border border-cyan-400/20 bg-slate-900/80 p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_10px_30px_rgba(2,6,23,0.35)]">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-cyan-400/30 border-t-cyan-400"></div>
          <p className="text-lg font-semibold text-slate-100">뉴스 데이터를 불러오는 중입니다</p>
          <p className="mt-2 text-sm text-slate-400">잠시만 기다려 주세요.</p>
        </div>
      </main>
    );
  }

  if (id && newsItem) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.22),_transparent_40%),linear-gradient(135deg,_#020617_0%,_#0f172a_45%,_#111827_100%)] px-3 py-4 text-slate-100 sm:px-4 sm:py-8">
        <div className="mx-auto max-w-5xl px-1 py-2 sm:px-4 sm:py-4">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-slate-900/80 px-4 py-2 text-sm font-black uppercase tracking-[0.2em] text-slate-200 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] transition-all duration-150 hover:-translate-x-0.5 hover:border-cyan-300/60 hover:text-cyan-200"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              {id ? "목록으로 돌아가기" : "뒤로 가기"}
            </button>
          </div>

          <article className="overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-slate-900/80 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_10px_30px_rgba(2,6,23,0.35)]">
            <div className="bg-gradient-to-r from-fuchsia-500 via-indigo-500 to-cyan-400 p-8 sm:p-10">
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-white/30 bg-white/20 px-3 py-1 text-[11px] font-black uppercase tracking-[0.25em] text-white/90">
                  {newsItem.g === "LiteStars" ? "LiteStars" : "GENERAL"}
                </span>
                <span className="flex items-center gap-2 rounded-full bg-slate-950/20 px-3 py-1 text-sm font-medium text-white/80">
                  <CalendarIcon className="h-4 w-4" />
                  {newsItem.d}
                </span>
              </div>
              <h1 className="text-2xl font-black leading-tight tracking-tight text-white sm:text-4xl">
                {newsItem.t.ko}
              </h1>
            </div>

            <div className="p-5 sm:p-10">
              <div className="rounded-[1.25rem] border border-cyan-400/20 bg-slate-950/60 p-4 shadow-[inset_0_0_20px_rgba(34,211,238,0.08)] sm:rounded-[1.5rem] sm:p-8">
                <p className="whitespace-pre-line text-[0.96rem] leading-[1.7] text-slate-300 sm:text-lg sm:leading-[1.9]">
                  {newsItem.c.ko.replace(/\\n/g, "\n")}
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-white/10 pt-6 text-sm text-slate-500">
                <span>© MinDevX updates</span>
                <span className="h-1 w-1 rounded-full bg-slate-600"></span>
                <span>Official Announcement</span>
              </div>
            </div>
          </article>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.22),_transparent_40%),linear-gradient(135deg,_#020617_0%,_#0f172a_45%,_#111827_100%)] px-4 py-8 text-slate-100">
      <div className="mx-auto max-w-6xl px-2 py-4 sm:px-4">
        <div className="mb-6 flex justify-end">
          <button
            onClick={handleExit}
            className="rounded-full border border-rose-400/30 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200 transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-500/20"
          >
            나가기
          </button>
        </div>

        <div className="mb-8 rounded-[1.5rem] border border-cyan-400/20 bg-slate-900/80 p-6 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_10px_30px_rgba(2,6,23,0.35)] sm:mb-10 sm:rounded-[2rem] sm:p-10">
          <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 via-fuchsia-500 to-cyan-400 shadow-lg shadow-indigo-500/20 sm:mb-6 sm:h-16 sm:w-16">
            <NewspaperIcon className="h-7 w-7 text-white sm:h-8 sm:w-8" />
          </div>
          <h1 className="mb-3 text-3xl font-black tracking-tight text-white sm:text-5xl">
            News & <span className="text-indigo-300">Updates</span>
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-6 text-slate-400 sm:text-lg sm:leading-7">
            실시간 공지와 업데이트를 한눈에 확인해 보세요.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-2 sm:gap-3">
          {[
            { id: "all", label: "전체 소식", color: "bg-indigo-500" },
            { id: "LiteStars", label: "LiteStars", color: "bg-fuchsia-500" },
            { id: "general", label: "공지사항", color: "bg-slate-700" },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setSelectedGame(btn.id)}
              className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.2em] transition-[background-color,border-color,color,transform] duration-100 active:scale-95 sm:px-5 sm:py-2.5 sm:text-sm ${
                selectedGame === btn.id
                  ? `${btn.color} text-white shadow-md shadow-black/20`
                  : "border-cyan-400/20 bg-slate-900/70 text-slate-300 hover:border-cyan-300/40 hover:bg-slate-800 hover:text-cyan-200 active:bg-slate-700"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredNewsList.map((item, index) => (
            <Link
              key={item.id}
              to={`/LiteStars/webview/News?id=${item.id}`}
              className="group relative flex flex-col overflow-hidden rounded-[1.25rem] border border-cyan-400/20 bg-slate-900/80 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_8px_18px_rgba(2,6,23,0.2)] transition-[transform,border-color,box-shadow] duration-100 hover:-translate-y-0.5 hover:border-cyan-300/40 sm:rounded-[1.5rem] sm:p-7"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-fuchsia-500/10 opacity-0 transition-opacity duration-100 group-hover:opacity-100"></div>
              <div className="relative flex items-center justify-between">
                <span
                  className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] ${
                    item.g === "LiteStars"
                      ? "bg-fuchsia-500/15 text-fuchsia-300"
                      : "bg-indigo-500/15 text-indigo-300"
                  }`}
                >
                  {item.g === "LiteStars" ? "LiteStars" : "공지"}
                </span>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                  <CalendarIcon className="h-3.5 w-3.5" />
                  {item.d}
                </div>
              </div>

              <h3 className="relative mt-5 text-xl font-bold leading-tight text-white transition-colors group-hover:text-indigo-200 sm:mt-6 sm:text-2xl">
                {item.t.ko}
              </h3>

              <p className="relative mt-3 flex-grow text-sm leading-6 text-slate-400 sm:mt-4 sm:leading-relaxed">
                {item.c.ko}
              </p>

              <div className="relative mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="inline-flex items-center gap-2 text-sm font-bold text-indigo-300">
                  자세히 읽기
                  <ChevronRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {filteredNewsList.length === 0 && (
          <div className="mt-8 rounded-[1.5rem] border border-cyan-400/20 bg-slate-900/70 py-16 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_8px_18px_rgba(2,6,23,0.2)]">
            <p className="text-slate-400">해당 카테고리에 등록된 뉴스가 없습니다.</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default NewsWebView;
