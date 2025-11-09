"use client";

import { Topbar } from "@components/Topbar";
import { Sidebar } from "@components/Sidebar";
import { Editor } from "@components/Editor";
import { NetlistPanel } from "@components/NetlistPanel";
import { useEditorStore } from "@lib/store";

export default function Page() {
  const nets = useEditorStore((s) => s.nets);
  return (
    <div className="flex flex-col h-screen">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 border-r border-border overflow-auto">
          <Sidebar />
        </div>
        <div className="flex-1">
          <Editor />
        </div>
        <div className="w-80 border-l border-border overflow-auto">
          <NetlistPanel nets={nets} />
        </div>
      </div>
    </div>
  );
}
