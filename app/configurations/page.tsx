"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import JoiningWordsTable from "./components/JoiningWordsTable";
import JoiningWordDialog from "./components/JoiningWordDialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import {
  addConfig,
  createJoiningWord,
  getActive,
  getAll,
  getAllConfigurations,
  updateConfig,
  updateConfigStatus,
  updateJoiningWord,
  updateJoiningWordStatus,
} from "./service";
import ConfigurationsTable from "./components/ConfigurationsTable";
import ConfigurationDialog from "./components/ConfigurationDialog";
import toast from "react-hot-toast";

const operator = "admin";

export default function ScriptConfigurations() {
  const [joiningWords, setJoiningWords] = useState([]);
  const [openScriptConfig, setOpenScriptConfig] = useState(false);
  const [editingJoiningWord, setEditingJoiningWord] = useState(null);

  const [configurations, setConfigurations] = useState([]);
  const [openConfiguration, setOpenConfiguration] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);

  useEffect(() => {
    loadJoiningWord();
    loadConfigurations();
  }, []);

  const handleCreateOrEdit = async (data: any, isEdit = false) => {
    if (isEdit) {
      try {
        // update word
        const res = await updateJoiningWord(data);
        const responseJson = await res?.json();
        if (!res.ok || res.status !== 200 || responseJson?.statusCode !== 200) {
          throw new Error("Error occured");
        }
        setJoiningWords((prev) =>
          prev.map((w) =>
            w.id == responseJson.data.id
              ? { ...w, joining_word: responseJson.data.joining_word }
              : w,
          ),
        );
        toast.success(responseJson?.message);
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        // create new word
        const res = await createJoiningWord({ ...data, operator: operator });
        const responseJson = await res?.json();
        if (!res.ok || res.status !== 201 || responseJson?.statusCode !== 200) {
          throw new Error("Error occured");
        }
        setJoiningWords((prev) => [
          ...prev,
          {
            id: responseJson?.data?.id,
            joining_word: data.joining_word,
            status: responseJson?.data?.status,
          },
        ]);
        toast.success(responseJson?.message);
      } catch (e) {
        console.log(e);
      }
    }

    setEditingJoiningWord(null);
    setOpenScriptConfig(false);
  };

  const handleCreateOrEditConfig = async (data: any, isEdit = false) => {
    if (isEdit) {
      try {
        // update word
        const res = await updateConfig(data);
        const responseJson = await res?.json();
        if (!res.ok || res.status !== 200 || responseJson?.statusCode !== 200) {
          throw new Error("Error occured");
        }
        setConfigurations((prev) =>
          prev.map((w) =>
            w.id == responseJson.data.id
              ? {
                  ...w,
                  key: responseJson.data.key,
                  sequence: responseJson.data.key,
                  value: responseJson.data.value,
                }
              : w,
          ),
        );
        toast.success(responseJson?.message);
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        // create new word
        const res = await addConfig({ ...data, operator: operator });
        const responseJson = await res?.json();
        if (!res.ok || res.status !== 201 || responseJson?.statusCode !== 200) {
          throw new Error("Error occured");
        }
        setConfigurations((prev) => [
          ...prev,
          {
            id: responseJson?.data?.id,
            key: responseJson.data.key,
            sequence: responseJson.data.key,
            value: responseJson.data.value,
            status: responseJson.data.status,
          },
        ]);
        toast.success(responseJson?.message);
      } catch (e) {
        console.log(e);
      }
    }

    setEditingConfig(null);
    setOpenConfiguration(false);
  };

  const handleEditStart = (row: any) => {
    setEditingJoiningWord(row);
    setOpenScriptConfig(true);
  };

  const handleEditConfig = (row: any) => {
    setEditingConfig(row);
    setOpenConfiguration(true);
  };

  const handleChangeJoiningWordsStatus = async (id: number, status: string) => {
    try {
      const res = await updateJoiningWordStatus({
        id,
        status: status,
        operator,
      });
      const responseJson = await res?.json();
      if (!res.ok || res.status !== 200 || responseJson?.statusCode !== 200) {
        throw new Error("Error occured");
      }
      const updatedRow = joiningWords.find((word) => word.id === id);
      const updatedJoiningWords = [...joiningWords].map((j) =>
        j.id === updatedRow.id ? { ...updatedRow, status: status } : j,
      ) as never[];
      setJoiningWords(updatedJoiningWords);
      toast.success(responseJson?.message);
    } catch (e) {
      console.log(e);
    }
  };

  const handleChangeConfigStatus = async (id: number, status: string) => {
    try {
      const res = await updateConfigStatus({
        id,
        status: status,
        operator,
      });
      const responseJson = await res?.json();
      if (!res.ok || res.status !== 200 || responseJson?.statusCode !== 200) {
        throw new Error("Error occured");
      }
      const updatedRow = configurations.find((config) => config.id === id);
      const updatedConfigurations = [...configurations].map((j) =>
        j.id === updatedRow.id ? { ...updatedRow, status: status } : j,
      ) as never[];
      setConfigurations(updatedConfigurations);
      toast.success(responseJson?.message);
    } catch (e) {
      console.log(e);
    }
  };

  const loadJoiningWord = async () => {
    try {
      const res = await getAll();
      setJoiningWords(res?.data || []);
    } catch (e) {
      console.log(e);
    }
  };

  const loadConfigurations = async () => {
    try {
      const res = await getAllConfigurations();
      setConfigurations(res?.data || []);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Script Configurations
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Handle all configurations required for script generations
          </p>
        </div>
      </div>
      <JoiningWordDialog
        open={openScriptConfig}
        setOpen={setOpenScriptConfig}
        onCreate={handleCreateOrEdit}
        editingJoiningWord={editingJoiningWord}
      />

      <Card className="bg-card mt-4">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Joining Words</CardTitle>
          <Button
            className="gap-2 bg-accent hover:bg-accent/90"
            onClick={() => {
              setOpenScriptConfig(true);
              setEditingJoiningWord(null);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Joining Words
          </Button>
        </CardHeader>

        <CardContent>
          <JoiningWordsTable
            joiningWords={joiningWords}
            onEdit={handleEditStart}
            onChangeStatus={handleChangeJoiningWordsStatus}
          />
        </CardContent>
      </Card>

      <ConfigurationDialog
        open={openConfiguration}
        setOpen={setOpenConfiguration}
        onCreate={handleCreateOrEditConfig}
        editingConfig={editingConfig}
      />

      <Card className="bg-card mt-4">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Configurations</CardTitle>
          <Button
            className="gap-2 bg-accent hover:bg-accent/90"
            onClick={() => {
              setOpenConfiguration(true);
              setEditingConfig(null);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Configurations
          </Button>
        </CardHeader>

        <CardContent>
          <ConfigurationsTable
            configurations={configurations}
            onEdit={handleEditConfig}
            onChangeStatus={handleChangeConfigStatus}
          />
        </CardContent>
      </Card>
    </div>
  );
}
