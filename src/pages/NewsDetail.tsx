import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  ArrowLeftIcon,
  CalendarIcon,
  NewspaperIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import rawNewsData from "../data/news.json";

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

const NewsDetail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<string>("all");

  useEffect(() => {
    setLoading(true);
    const list = rawNewsData.newsList;
    setNewsList(list);

    if (id) {
      const item = list.find(
        (item: NewsItem) => item.id === parseInt(id, 10)
      );
      item ? setNewsItem(item) : setError("News item not found");
    }
    setLoading(false);
  }, [id]);

  const filteredNewsList =
    selectedGame === "all"
      ? newsList
      : newsList.filter((item) =>
          selectedGame === "LogiCity"
            ? item.g === "LogiCity"
            : item.g !== "LogiCity"
        );

  if (loading) {
    return (
      <main className="container-glass smooth-scroller py-8">
        <div className="min-h-[60vh] flex flex-col items-center justify-center card p-8">
          <div className="w-10 h-10 mb-4 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
          <p className="text-gray-500 animate-pulse">Loading news data</p>
        </div>
      </main>
    );
  }

  if (id && newsItem) {
    return (
      <main className="container-glass smooth-scroller py-8">
        <div className="max-w-4xl px-4 py-12 mx-auto sm:px-6 lg:px-8 animate-fade-in-up">
          {/* Back Button */}
        <Link
          to="/news"
          className="inline-flex items-center gap-2 mb-8 text-sm font-bold text-slate-500 transition-colors hover:text-indigo-600 dark:text-slate-400 group"
        >
          <ArrowLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          목록으로 돌아가기
        </Link>

        <article className="overflow-hidden bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800">
          {/* Header Section */}
          <div className="p-10 text-white bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-4 py-1.5 text-xs font-black tracking-widest uppercase rounded-full bg-white/20 backdrop-blur-md">
                {newsItem.g === "nyangnyang" ? "냥냥식당타이쿤" : "GENERAL"}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium opacity-80">
                <CalendarIcon className="w-4 h-4" />
                {newsItem.d}
              </span>
            </div>
            <h1 className="text-3xl font-black leading-tight tracking-tighter md:text-5xl">
              {newsItem.t.ko}
            </h1>
          </div>

          {/* Content Section */}
          <div className="p-10 md:p-14">
            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tight prose-p:leading-relaxed">
              <p className="leading-[1.8] text-slate-700 dark:text-slate-300 whitespace-pre-line font-light text-lg">
                {newsItem.c.ko.replace(/\\n/g, "\n")}
              </p>
            </div>

            <div className="pt-8 mt-16 border-t border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-4 text-sm italic text-gray-400">
                <span>© MinDevX updates</span>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <span>Official Announcement</span>
              </div>
            </div>
          </div>
        </article>
      </div>
      </main>
    );
  }

  return (
    <main className="container-glass smooth-scroller py-8">
      <div className="max-w-6xl px-4 py-16 mx-auto sm:px-6 lg:px-8">
      <div className="mb-16 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 mb-8 text-white shadow-xl rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-indigo-500/20">
          <NewspaperIcon className="w-10 h-10" />
        </div>
        <h1 className="mb-4 text-5xl font-black tracking-tighter text-slate-900 dark:text-white md:text-6xl">
          News &{" "}
          <span className="text-indigo-600 dark:text-indigo-400">Updates</span>
        </h1>
        <p className="text-lg font-light text-slate-500 dark:text-slate-400">
          MinDevX의 새로운 소식을 가장 먼저 만나보세요.
        </p>
      </div>

      {/* Modern Filter Chips */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {[
          { id: "all", label: "전체 소식", color: "bg-indigo-600" },
          { id: "LogiCity", label: "LogiCity", color: "bg-pink-600" },
          { id: "general", label: "공지사항", color: "bg-slate-800" },
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setSelectedGame(btn.id)}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
              selectedGame === btn.id
                ? `${btn.color} text-white shadow-lg scale-105`
                : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {filteredNewsList.map((item, index) => (
          <Link
            key={item.id}
            to={`/newsdetail?id=${item.id}`}
            className="group relative flex flex-col p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between mb-6">
              <span
                className={`px-4 py-1 rounded-xl text-[10px] font-black tracking-widest uppercase ${
                  item.g === "LogiCity"
                    ? "bg-pink-50 text-pink-600 dark:bg-pink-900/20"
                    : "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20"
                }`}
              >
                {item.g === "LogiCity" ? "LogiCity" : "공지"}
              </span>
              <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                <CalendarIcon className="w-3.5 h-3.5" />
                {item.d}
              </div>
            </div>

            <h3 className="mb-4 text-2xl font-bold leading-tight text-slate-900 transition-colors dark:text-white group-hover:text-indigo-600">
              {item.t.ko}
            </h3>

            <p className="flex-grow mb-8 font-light leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2">
              {item.c.ko}
            </p>

            <div className="flex items-center justify-between pt-6 mt-auto border-t border-slate-100 dark:border-white/10">
              <span className="inline-flex items-center gap-1 text-sm font-bold text-indigo-600 dark:text-indigo-400">
                자세히 읽기
                <ChevronRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {filteredNewsList.length === 0 && (
        <div className="py-20 text-center bg-slate-100 dark:bg-slate-900/50 rounded-3xl">
          <p className="text-slate-500">
            해당 카테고리에 등록된 뉴스가 없습니다.
          </p>
        </div>
      )}
    </div>
    </main>
  )
};

export default NewsDetail;
