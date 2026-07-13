import React, { useState, useEffect } from "react";

interface ShopItem {
  id: string;
  title: { ko: string; en: string };
  desc: { ko: string; en: string };
  start: string;
  end: string;
  cost: {
    Coin: number;
    Reputation: number;
    Crystal: number;
  };
  reward: {
    fridge: [{ item: number; qty: number }];
    NyangDrop: { qty: number; rarity: string; cnt: number };
    MegaBox: { qty: number };
    Coin: { qty: number };
    Affection: { qty: number };
    Crystal: { qty: number };
    NyangPassXP: { qty: number };
  };
}

interface voucherItem {
  id: string;
  voucher: string;
}

const Store = () => {
  const [shops, setShops] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [vouchers, setVouchers] = useState<voucherItem[]>([]);
  const [loadingVouchers, setLoadingVouchers] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/Shop.json`)
      .then((res) => res.json())
      .then((data) => {
        if (!data?.list) throw new Error("Invalid data");
        setShops(data.list);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/voucher.json`)
      .then((res) => res.json())
      .then((data) => {
        if (!data?.list) throw new Error("Invalid data");
        setVouchers(data.list);
      })
      .catch(() => setError(true))
      .finally(() => setLoadingVouchers(false));
  }, []);

  function givecodeShopItem(item: ShopItem) {
    const id: string = item.id;
    const targetVoucher = vouchers.find((v) => v.id === id);

    if (targetVoucher) {
      const deepLink = "logicity://voucher/" + targetVoucher.voucher;

      window.location.href = deepLink;

      alert("앱이 자동으로 실행되지 않으면 설치후 시도해주세요");
    }
  }

  if (loading || loadingVouchers) {
    return (
      <main className="container-glass smooth-scroller py-8 min-h-screen font-sans">
        <div className="bg-white dark:bg-slate-900 card p-8">
          <div className="text-center mb-12 md:mb-20">
            <div className="h-10 bg-slate-200 rounded-lg w-1/2 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-slate-200 rounded-lg w-3/4 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md p-6 animate-pulse"
              >
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6 mb-6"></div>
                <div className="space-y-3">
                  <div className="h-5 bg-slate-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container-glass smooth-scroller py-8 min-h-screen">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center p-8 bg-white rounded-xl shadow-md dark:bg-slate-900 dark:border dark:border-slate-700">
            <h2 className="text-2xl font-bold text-red-600 mb-2">😥 오류 발생</h2>
            <p className="text-slate-600 dark:text-slate-300">
              상점 데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container-glass smooth-scroller py-8 min-h-screen">
      <div className="card p-8 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <section className="text-center mb-12 md:mb-20">
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 mb-4 tracking-tight">
              LogiCity 상점
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
              
            </p>
          </section>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {shops.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              <div className="p-6 flex-grow">
                <div className="text-xs text-indigo-500 font-semibold mb-2">
                  🗓️ {item.start} ~ {item.end}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {item.title.ko}
                </h3>
                <p className="text-slate-600 text-sm mb-6 h-10">
                  {item.desc.ko}
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-700 mb-2 text-sm">
                      필요 재화
                    </h4>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {item.cost.Coin > 0 && (
                        <span className="bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded-full font-medium">
                          🪙 코인: {item.cost.Coin.toLocaleString()}
                        </span>
                      )}
                      {item.cost.Reputation > 0 && (
                        <span className="bg-sky-100 text-sky-800 px-2.5 py-1 rounded-full font-medium">
                          ⭐ 평판: {item.cost.Reputation.toLocaleString()}
                        </span>
                      )}
                      {item.cost.Crystal > 0 && (
                        <span className="bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full font-medium">
                          💎 크리스탈: {item.cost.Crystal.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-700 mb-2 text-sm">
                      보상
                    </h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                      {item.reward.fridge?.map((f, idx) => (
                        <li key={`fridge-${idx}`} className="flex items-center">
                          <span className="mr-2">🧊</span>
                          <span>
                            냉장고 아이템 (ID: {f.item}) x{f.qty}
                          </span>
                        </li>
                      ))}
                      {item.reward.NyangDrop?.qty > 0 && (
                        <li className="flex items-center">
                          <span className="mr-2">💧</span>
                          <span>
                            냥 드롭 ({item.reward.NyangDrop.rarity})와 {item.reward.NyangDrop.cnt}의 분열 x
                            {item.reward.NyangDrop.qty}
                          </span>
                        </li>
                      )}
                      {item.reward.MegaBox?.qty > 0 && (
                        <li className="flex items-center">
                          <span className="mr-2">🎁</span>
                          <span>메가박스 x{item.reward.MegaBox.qty}</span>
                        </li>
                      )}
                      {item.reward.Coin?.qty > 0 && (
                        <li className="flex items-center">
                          <span className="mr-2">💰</span>
                          <span>코인 x{item.reward.Coin.qty}</span>
                        </li>
                      )}
                      {item.reward.Affection?.qty > 0 && (
                        <li className="flex items-center">
                          <span className="mr-2">💖</span>
                          <span>호감도 x{item.reward.Affection.qty}</span>
                        </li>
                      )}
                      {item.reward.Crystal?.qty > 0 && (
                        <li className="flex items-center">
                          <span className="mr-2">💎</span>
                          <span>크리스탈 x{item.reward.Crystal.qty}</span>
                        </li>
                      )}
                      {item.reward.NyangPassXP?.qty > 0 && (
                        <li className="flex items-center">
                          <span className="mr-2">✨</span>
                          <span>냥패스 XP x{item.reward.NyangPassXP.qty}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-700 mb-2 text-sm">
                      주의: 현재 해당 시스템은 현재 클라이언트에 적용되지 않습니다. 다음 정기 업데이트 배포판이 필요합니다.
                    </div>

                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 mt-auto">
                <button
                  className="w-full px-4 py-3 text-base font-bold text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-slate-400"
                  onClick={() => givecodeShopItem(item)}
                >
                  받기
                </button>
                <p className="text-xs text-slate-500 mt-2 text-center">
                  이미 받거나 재화가 부족할 시 수령되지 않습니다.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
};

export default Store;
