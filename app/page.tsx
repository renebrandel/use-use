import { CodeEditor } from "@/components/Editor";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense>
      <main className="flex flex-col content-center items-center gap-2">
        <div className="text-center">
          <h1 className="text-5xl">&quot;use use&quot;</h1>
          <div className="italic">because why not? Inspired by <a href="https://twitter.com/dabit3/status/1752143163546911036">this tweet</a>.</div>
        </div>
        <CodeEditor />
        <div>Made by <a className="underline" href="https://github.com/renebrandel">Rene Brandel</a></div>
      </main>
    </Suspense>
  );
}
