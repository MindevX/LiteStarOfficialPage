import React, { useEffect, useState } from "react";
import { servermaintenanacement } from "../config";

const formatRemainingTime = (milliseconds: number) => {
  const totalSeconds = Math.max(Math.floor(milliseconds / 1000), 0);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];
  if (days > 0) parts.push(`${days}일`);
  if (hours > 0 || days > 0) parts.push(`${hours}시간`);
  parts.push(`${minutes}분`);
  parts.push(`${seconds}초`);

  return parts.join(" ");
};

const ServerMaintenancement = () => {
  const targetTime = servermaintenanacement.ETC.getTime();
  const [remainingMs, setRemainingMs] = useState(
    Math.max(targetTime - Date.now(), 0)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingMs(Math.max(targetTime - Date.now(), 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetTime]);

  const isPastEstimated = remainingMs <= 0;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-slate-100">
      <div className="absolute inset-0 opacity-30 blur-3xl">
        <div className="absolute top-10 left-1/4 w-80 h-80 rounded-full bg-violet-500/30" />
        <div className="absolute top-1/3 right-0 w-72 h-72 rounded-full bg-cyan-500/20" />
        <div className="absolute bottom-10 left-10 w-64 h-64 rounded-full bg-indigo-400/15" />
      </div>

      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-20">
        <div className="w-full max-w-4xl rounded-[2rem] border border-white/10 bg-white/10 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
          <div className="flex flex-col gap-6 md:gap-8">
            <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200 shadow-sm shadow-cyan-500/10">
              주요 알림
            </div>
            <div>
              <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl">
                서버 점검 중입니다.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
                {servermaintenanacement.message}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-white/15 bg-slate-950/80 p-6 shadow-lg shadow-slate-950/30">
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
                  예상 재개 시간
                </h2>
                <p className="mt-3 text-2xl font-bold text-white">
                  {servermaintenanacement.ETC.toLocaleString()}
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  실제 상황은 변경될 수 있습니다. 조금만 기다려 주세요.
                </p>
              </div>
              <div className="rounded-3xl border border-white/15 bg-slate-950/80 p-6 shadow-lg shadow-slate-950/30">
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-300">
                  남은 시간
                </h2>
                <p className="mt-3 text-3xl font-bold text-white">
                  {isPastEstimated ? "00분 00초" : formatRemainingTime(remainingMs)}
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  {isPastEstimated
                    ? "예상 시간이 지났습니다. 페이지를 새로고침하고 다시 시도해 주세요."
                    : "정확한 남은 시간을 실시간으로 표시합니다."}
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-white/10 to-white/5 p-6">
              <p className="text-sm text-slate-300">
                {isPastEstimated ? (
                  "예상 시간이 지나 점검이 종료되었을 수 있습니다. 페이지를 새로고침하고 다시 시도해 주세요."
                ) : (
                  "다른 페이지를 확인하려면 점검이 끝난 후 다시 시도해 주세요. 현재는 모든 접근이 점검 화면으로 리디렉션됩니다."
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerMaintenancement;