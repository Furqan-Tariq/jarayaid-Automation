"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllScripts } from "../script-generation/service";
import toast from "react-hot-toast";
import ScriptsTable from "./components/ScriptsTable";
import { generateVideo } from "./service";
import { Loader } from "lucide-react";

export default function ScriptGeneration() {
  const [scripts, setScripts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedScript, setSelectedScript] = useState<any>(null);

  useEffect(() => {
    loadScripts();
  }, []);

  useEffect(() => {
    if (loading && selectedScript) {
      handleGenerateVideo();
    }
  }, [loading, selectedScript]);

  const loadScripts = async () => {
    try {
      const res = await getAllScripts();
      const data = res.data || [];

      const countryGroups: Record<number, any[]> = {};
      data.forEach((script) => {
        if (!countryGroups[script.country_id])
          countryGroups[script.country_id] = [];
        countryGroups[script.country_id].push(script);
      });

      const rows: any[] = [];

      Object.values(countryGroups).forEach((scripts) => {
        const sortedScripts = scripts.sort((a, b) => a.id - b.id);
        let tempSet: any = {};
        sortedScripts.forEach((script) => {
          try {
            const parsed = JSON.parse(script.prompt);
            Object.entries(parsed).forEach(([key, value]) => {
              tempSet[key] = value;
            });
          } catch {
            tempSet["unknown"] = script.prompt;
          }

          if (
            tempSet["script_s10"] ||
            script === sortedScripts[sortedScripts.length - 1]
          ) {
            const combinedOverview = Object.values(tempSet).join(" ");
            rows.push({
              country_id: script.country_id,
              country_name: script.country_name,
              status: script.status,
              overview:
                combinedOverview.length > 200
                  ? combinedOverview.slice(0, 200) + "…"
                  : combinedOverview,
            });
            tempSet = {};
          }
        });
      });

      setScripts(rows);
    } catch (err) {
      console.error("Error loading scripts", err);
    }
  };

  const handleGenerateVideoClick = (script: any) => {
    setLoading(true);
    setSelectedScript(script);
  };

  const handleGenerateVideo = async () => {
    toast.success(`Generating video for ${selectedScript.country_name}`);
    try {
      const response = await generateVideo({
        country_id: selectedScript.country_id,
      });
      const responseJSON = await response?.json();
      if (
        !response?.ok ||
        response.status !== 201 ||
        responseJSON?.status !== "SUCCESS"
      ) {
        toast.error("Error occured while generating video");
        return;
      }
      const videoUrl = responseJSON?.results?.[0]["video_url"];
      if (!videoUrl) {
        toast.error("Server error while generating video");
        return;
      }
      window.open(videoUrl, "_blank");
      
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
      setSelectedScript(null);
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <Loader className="animate-spin w-10 h-10 text-white" />
        </div>
      )}
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Script & Video Generation</h1>
          <p className="text-sm text-muted-foreground mt-1">AI-Powered</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Generated News Bulletins</CardTitle>
          </CardHeader>
          <CardContent>
            <ScriptsTable
              scripts={scripts}
              onGenerate={handleGenerateVideoClick}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
