import React, { useState, useEffect } from "react";

interface LicenseItem {
  name: string;
  path: string;
}

const LicenseViewer: React.FC<{ item: LicenseItem }> = ({ item }) => {
  const [text, setText] = useState("");

  useEffect(() => {
    fetch(item.path)
      .then((res) => res.text())
      .then((data) => setText(data))
      .catch((e) =>
        console.error(`Failed to load license for ${item.name}:`, e)
      );
  }, [item.path, item.name]);

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-2xl shadow-slate-900/10 transition hover:-translate-y-1 hover:shadow-slate-900/20 dark:border-slate-800/80 dark:bg-slate-950/90">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
            LICENSE
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">
            {item.name}
          </h2>
        </div>
        <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700 ring-1 ring-indigo-100 dark:bg-indigo-500/15 dark:text-indigo-200 dark:ring-indigo-500/10">
          public document
        </span>
      </div>

      <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-5 text-sm leading-7 text-slate-700 shadow-sm dark:border-slate-800/70 dark:bg-slate-900 dark:text-slate-300">
        <pre className="whitespace-pre-wrap font-sans bg-transparent m-0">
          {text || "Loading License Data..."}
        </pre>
      </div>
    </div>
  );
};

const License: React.FC = () => {
  const licenseList: LicenseItem[] = [
    {
      name: "Noto Sans KR",
      path: `${process.env.PUBLIC_URL}/license/font-kr.txt`,
    },
    {
      name: "Firebase",
      path: `${process.env.PUBLIC_URL}/license/firebase.txt`,
    }
  ];

  return (
    <div className="bg-slate-50 py-16 dark:bg-slate-950">
      <div className="container px-4 mx-auto max-w-6xl">
        <div className="mb-12 rounded-[2rem] border border-slate-200/80 bg-white/80 p-10 shadow-2xl shadow-slate-900/5 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/80">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400">
              License Information
            </p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Licenses used by the project
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
              On this page, you can view the licenses for the key assets included in the project. All licenses are
              transparently disclosed; please feel free to refer to the materials as needed.
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {licenseList.map((item, index) => (
            <LicenseViewer key={index} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default License;