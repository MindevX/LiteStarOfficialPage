import React, { useState, useEffect } from "react";
import Modal from "../components/Modal";
import {
  ArrowDownTrayIcon,
  SparklesIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";
import {
  ChevronDown,
  ChevronUp,
  Gamepad2,
  Heart,
  Trophy,
  Users,
  Coins,
  ArrowRight,
} from "lucide-react";
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


const Test = [
  { category: "You found an easter egg", detail: "100", probability: "100" },
];


const ProbabilityTable: React.FC<{
  title: string;
  data: any[];
  onItemClick?: (item: any) => void;
}> = ({ title, data, onItemClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const groupedData: { [key: string]: any[] } = data.reduce((acc, item) => {
    acc[item.category] = [...(acc[item.category] || []), item];
    return acc;
  }, {} as { [key: string]: any[] });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Coin":
        return <Coins className="w-4 h-4 text-amber-500" />;
      case "Affection":
        return <Heart className="w-4 h-4 text-rose-500" />;
      case "Customer":
        return <Users className="w-4 h-4 text-sky-500" />;
      case "MegaBox":
        return <Trophy className="w-4 h-4 text-purple-500" />;
      case "Ingredient":
        return <Gamepad2 className="w-4 h-4 text-emerald-500" />;
      default:
        return <SparklesIcon className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="mb-6 overflow-hidden transition-all duration-300 border border-gray-200 shadow-sm dark:border-white/10 rounded-2xl bg-white/70 dark:bg-slate-900/50 backdrop-blur-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-6 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg dark:bg-indigo-900/30">
            <ChartBarIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <span className="font-bold text-gray-800 dark:text-gray-100">
            {title}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="text-gray-400" />
        ) : (
          <ChevronDown className="text-gray-400" />
        )}
      </button>

      <div
        className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${
          isOpen ? "" : "max-h-0"
        }`}
      >
        <div className="p-4 overflow-x-auto border-t border-gray-100 dark:border-white/5">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-gray-100 dark:border-white/5">
                <th className="px-4 py-3 font-medium text-left">종류</th>
                <th className="px-4 py-3 font-medium text-left">세부 보상</th>
                <th className="px-4 py-3 font-medium text-right">확률</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {Object.entries(groupedData).map(([category, items]) =>
                items.map((item, index) => (
                  <tr
                    key={`${category}-${index}`}
                    onClick={() =>
                      item.category === "MegaBox" && onItemClick?.(item)
                    }
                    className={`group transition-colors hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 ${
                      item.category === "MegaBox" ? "cursor-pointer" : ""
                    }`}
                  >
                    {index === 0 && (
                      <td
                        className="px-4 py-3 font-bold text-gray-700 dark:text-gray-200"
                        rowSpan={items.length}
                      >
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(category)}
                          {category}
                        </div>
                      </td>
                    )}
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {item.detail}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="px-2 py-0.5 font-mono text-xs font-bold text-indigo-600 bg-indigo-50 rounded-md dark:bg-indigo-500/10 dark:text-indigo-400">
                        {item.probability}%
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const LogiCityDescription = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showProbability, setShowProbability] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const startDate = new Date(2025, 0, 25);
    if (new Date() >= startDate) setShowProbability(true);

    const list = rawNewsData.newsList;
    
    setNews(
      list
        .filter((n: NewsItem) => n.g === "LogiCity")
        .slice(0, 5)
    );
    setLoading(false);
  }, []);

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="🎁 메가박스 상세 정보"
      >
        <div className="space-y-4">
          <p className="leading-relaxed text-gray-600 dark:text-gray-400">
            메가박스는 일일 보상에서{" "}
            <span className="font-bold text-indigo-500">6.5%</span>의 확률로
            등장하는 최상급 보상입니다.
          </p>
          <div className="p-4 border border-indigo-100 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 dark:border-indigo-500/20">
            <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
              💡 한 번의 개봉으로 최소 7개에서 최대 15개의 보상이 쏟아집니다!
              식당 성장을 위한 필수 아이템들을 획득해 보세요.
            </p>
          </div>
        </div>
      </Modal>

      <main className="container-glass smooth-scroller py-8">
        <div className="px-4 sm:px-6 lg:px-8 pb-24 mx-auto space-y-16 md:space-y-24 max-w-7xl animate-fade-in-up"></div>
        {/* Hero Section */}
        <div className="relative group overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-600 p-1 px-1 shadow-2xl transition-all duration-500 hover:shadow-indigo-500/20">
          <div className="relative bg-white dark:bg-slate-950 rounded-[2.4rem] p-10 md:p-16 overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute w-64 h-64 rounded-full -top-24 -right-24 bg-rose-500/10 blur-3xl animate-pulse" />
            <div className="absolute w-64 h-64 rounded-full -bottom-24 -left-24 bg-indigo-500/10 blur-3xl animate-pulse" />

            <div className="relative z-10 flex flex-col items-center text-center">
            <div className="mb-6 text-7xl animate-float">🐾</div>
              <h1 className="mb-4 text-5xl font-black tracking-tighter text-transparent md:text-7xl bg-gradient-to-r from-rose-500 to-indigo-600 bg-clip-text">
                LogiCity
              </h1>
              <p className="max-w-2xl mb-8 text-lg font-light leading-relaxed text-gray-500 md:text-xl dark:text-gray-400">
                지원 예정 대상: android
              </p>
              <div className="flex flex-col justify-center w-full gap-4 sm:flex-row">
                <a
                  href="https://kjh12.itch.io/nyangrestauranttycoon"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 font-bold text-white transition-all duration-300 bg-indigo-600 shadow-lg shadow-indigo-500/20 dark:bg-indigo-500 rounded-2xl hover:bg-indigo-700 dark:hover:bg-indigo-600 hover:scale-105 active:scale-95"
                >
                  <ArrowDownTrayIcon className="w-5 h-5" />
                  지금 무료 다운로드
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Main Content */}
          <div className="space-y-12 lg:col-span-8">
            {/* Intro Card */}
            <section className="p-8 bg-white border border-gray-100 shadow-xl dark:bg-slate-900/70 rounded-3xl dark:border-white/5 backdrop-blur-md">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center justify-center w-10 h-10 bg-rose-100 dark:bg-rose-900/30 rounded-xl text-rose-600">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black tracking-tight text-gray-900 uppercase dark:text-white">
                  Game Introduction
                </h2>
              </div>

              <p className="mb-8 text-lg font-light leading-relaxed text-gray-600 dark:text-gray-400">
                
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  {
                    icon: "",
                    label: "",
                    desc: "",
                  },
                  { icon: "", label: "", desc: "" },
                  {
                    icon: "",
                    label: "",
                    desc: "",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-6 transition-all duration-300 border border-gray-100 rounded-2xl bg-slate-50 dark:bg-slate-900/50 dark:border-white/10 hover:shadow-lg hover:border-indigo-500/20 hover:-translate-y-1"
                  >
                    <div className="mb-3 text-3xl">{item.icon}</div>
                    <div className="mb-1 font-bold text-gray-800 dark:text-white">
                      {item.label}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Probability Tables */}
            {showProbability && (
              <section className="animate-fade-in-up">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600">
                    <SparklesIcon className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-black tracking-tight text-gray-900 uppercase dark:text-white">
                    Probabilities
                  </h2>
                </div>
                <ProbabilityTable
                  title=""
                  data={Test}
                />
                <br />
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-8 lg:col-span-4">
            <div className="sticky top-24">
              {/* Sidebar News */}
              <div className="p-6 bg-white border border-gray-100 shadow-xl dark:bg-slate-900/70 rounded-3xl dark:border-white/5 backdrop-blur-md">
                <h3 className="flex items-center gap-3 mb-6 text-xl font-black text-gray-900 dark:text-white">
                  <SparklesIcon className="w-5 h-5 text-amber-500" />
                  최신 소식
                </h3>
                <div className="space-y-4">
                  {loading ? (
                    <div className="h-40 bg-slate-100 dark:bg-white/5 rounded-2xl animate-pulse" />
                  ) : (
                    news.map((item) => (
                      <a
                        key={item.id}
                        href={`#/newsdetail?id=${item.id}`}
                        className="block p-4 transition-all duration-300 border border-transparent rounded-2xl bg-slate-50 dark:bg-slate-900/50 hover:bg-white hover:shadow-md hover:border-indigo-100 dark:hover:bg-slate-800 dark:hover:border-indigo-500/20 group"
                      >
                        <div className="mb-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                          {item.d}
                        </div>
                        <h4 className="font-bold text-gray-800 transition-colors dark:text-gray-200 group-hover:text-indigo-600 line-clamp-1">
                          {item.t.ko}
                        </h4>
                        <div className="flex items-center gap-1 mt-2 text-xs font-bold text-gray-400 group-hover:text-indigo-500">
                          READ MORE <ArrowRight className="w-3 h-3" />
                        </div>
                      </a>
                    ))
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
};

export default LogiCityDescription;
