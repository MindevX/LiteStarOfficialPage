import React, { useEffect, useMemo, useState } from "react";

const apiBaseUrl = `${process.env.PUBLIC_URL || ""}/api`;

interface MapItem {
  MapCode: string;
  SpecialEffects: Record<string, unknown>[];
}

interface RotationSchedule {
  rotationIntervalMinutes: number;
  Map: MapItem[];
}

type RotationData = Record<string, RotationSchedule[]>;

const MapRotation = () => {
  const [now, setNow] = useState(() => new Date());
  const [mapRotationData, setMapRotationData] = useState<RotationData>({});

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    fetch(`${apiBaseUrl}/map-rotation.json`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("map-rotation.json not found");
        }
        return res.json();
      })
      .then((data) => setMapRotationData(data as RotationData))
      .catch(() => setMapRotationData({}));

    return () => window.clearInterval(timer);
  }, []);

  const sections = useMemo(() => {
    return Object.entries(mapRotationData).map(
      ([category, schedules]) => ({
        category,
        schedules: schedules.map((schedule, index) => ({
          key: `${category}-${index}`,
          intervalMinutes: schedule.rotationIntervalMinutes,
          maps: schedule.Map ?? [],
        })),
      })
    );
  }, [mapRotationData]);

  const utcTimeLabel = useMemo(() => {
    return now.toISOString().replace("T", " ").replace(".000Z", " UTC");
  }, [now]);

  const getActiveMap = (schedule: { intervalMinutes: number; maps: MapItem[] }) => {
    if (!schedule.maps.length) {
      return null;
    }

    const minuteOffset = Math.floor(now.getTime() / 60000);
    const index = Math.floor(minuteOffset / schedule.intervalMinutes) % schedule.maps.length;

    return schedule.maps[index];
  };

  const getSpecialEffectText = (effects: Record<string, unknown>[] = []) => {
    if (!effects.length) {
      return "특수 효과 없음";
    }

    const normalized = effects.filter(
      (effect) => effect && Object.keys(effect).length > 0
    );

    if (!normalized.length) {
      return "특수 효과 없음";
    }

    return normalized
      .map((effect) =>
        Object.entries(effect)
          .map(([key, value]) => `${key}: ${String(value)}`)
          .join(", ")
      )
      .join(" / ");
  };

  return (
    <main className="container-glass smooth-scroller py-8 min-h-screen">
      <div className="card p-8 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <section className="text-center mb-8 md:mb-12">
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 mb-4 tracking-tight">
              맵 로테이션 정보
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
              UTC 기준으로 로테이션 간격에 따라 현재 활성 맵을 표시합니다.
            </p>
          </section>

          <div className="mb-8 rounded-xl border border-slate-200 bg-slate-50 p-4 text-center shadow-sm">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              현재 UTC 시간
            </div>
            <div className="mt-2 text-xl font-bold text-slate-900">{utcTimeLabel}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map(({ category, schedules }) => (
            <div
              key={category}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              <div className="p-6 flex-grow">
                <div className="text-xs text-indigo-500 font-semibold mb-2">🗺️ {category}</div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{category}</h3>
                <p className="text-slate-600 text-sm mb-6">
                  각 로테이션 구간마다 포함된 맵과 특수 효과를 확인할 수 있습니다.
                </p>

                <div className="space-y-4">
                  {schedules.map((schedule) => {
                    const activeMap = getActiveMap(schedule);
                    return (
                      <div
                        key={schedule.key}
                        className="rounded-lg border border-slate-200 p-4"
                      >
                        <div className="text-sm font-semibold text-slate-700 mb-2">
                          ⏱️ 로테이션 간격: {schedule.intervalMinutes.toLocaleString()}분
                        </div>
                        <div className="mb-3 rounded-md bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                          🔄 현재 활성 맵: {activeMap?.MapCode ?? "없음"}
                        </div>
                        <ul className="space-y-2">
                          {schedule.maps.map((map, idx) => {
                            const isActive = activeMap?.MapCode === map.MapCode;
                            return (
                              <li
                                key={`${schedule.key}-${idx}`}
                                className={`rounded-md p-3 ${
                                  isActive ? "border border-emerald-400 bg-emerald-50" : "bg-slate-50"
                                }`}
                              >
                                <div className="font-semibold text-slate-800">
                                  {map.MapCode}
                                  {isActive ? " (현재)" : ""}
                                </div>
                                <div className="text-sm text-slate-600 mt-1">
                                  {getSpecialEffectText(map.SpecialEffects)}
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default MapRotation;
