"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchJson } from "@/lib/fetchJson";
import CountriesTable from "./components/CountriesTable";
import SourcesTable from "./components/SourcesTable";
import QuickScheduler from "./components/QuickScheduler";
import {
  createScheduler,
  createSource,
  getAll,
  getSchedulers,
  getSourcesByCountryID,
  updateSchedule,
  updateSource,
  updateSources,
} from "./service";
import useGetCategories from "@/hooks/useGetCategories";
import { getActiveJoiningWords } from "../configurations/service";
import toast from "react-hot-toast";

type SavedCountry = {
  id: number;
  country_name: string;
  // enabled?: boolean;
  // status?: "Manual" | "Auto";
};

const validPlatforms = ["TIKTOK", "FACEBOOK", "INSTAGRAM", "YOUTUBE"];

const operator = "admin";

export default function CountriesSourcesPage() {
  const [countries, setCountries] = useState<SavedCountry[]>([]);
  const [countryScheduler, setCountryScheduler] = useState<any[]>([]);
  const [countrySchedulerCopy, setCountrySchedulerCopy] = useState("");
  const [sources, setSources] = useState([]);
  const [joininWords, setJoininWords] = useState([]);
  const [sourcesCopy, setSourcesCopy] = useState("");
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(
    null,
  );
  const sourcesRef = useRef<HTMLDivElement | null>(null);
  const [isCountriesAPICalled, setIsCountriesAPICalled] = useState(false);

  const getCategories = useGetCategories();

  const loadCountries = async () => {
    try {
      const [activeCountriesData, res] = await Promise.all([
        getAll(),
        getCategories(),
      ]);
      const activeList = activeCountriesData?.data || [];

      const activeMap = activeList.reduce((acc: any, item: any) => {
        acc[item.country_id] = item;
        return acc;
      }, {});
      const mapped: SavedCountry[] = res.map((c: any) => ({
        id: c.id,
        country_name: c.name,
        status: activeMap[c.id]?.status ?? "INACTIVE",
        country_info_id: activeMap[c.id]?.id ?? null,
        type: activeMap[c.id]?.type ?? "AUTO",
      }));

      setCountries(mapped);
      setIsCountriesAPICalled(true);
    } catch (err) {
      console.error(err);
    }
  };

  const loadSavedSources = async () => {
    try {
      const [activeSourcesData, response]: [any, any] = await Promise.all([
        getSourcesByCountryID(selectedCountryId as number),
        fetchJson("admin-dashboard/getRssSourcesByID/" + selectedCountryId),
      ]);

      const activeSources = activeSourcesData?.data;

      const activeMap = activeSources.reduce((acc: any, item: any) => {
        acc[item.jarayid_source_id] = item;
        return acc;
      }, {});

      const sources = response?.data[0]?.rssCategoriesUrls?.map((row: any) => ({
        id: row?.ID,
        source: row?.NAME,
        news_source: row?.SOURCE_URL,
        status: activeMap[row?.ID]?.status ?? "INACTIVE",
        article_count: activeMap[row?.ID]?.article_count || "",
        sequence: activeMap[row?.ID]?.sequence || "",
        type: activeMap[row?.ID]?.type || "",
        joining_words: activeMap[row?.ID]?.joining_words || "",
        intro_music_path: activeMap[row?.ID]?.intro_music_path || "",
        jarayid_rss_source_id: row?.SOURCE_ID,
        source_id: activeMap[row?.ID]?.id || null, // id from automation db
      }));

      setSources(sources);
      setSourcesCopy(JSON.stringify(sources));
    } catch (e) {
      console.error(e);
    }
  };

  const loadScheduler = async () => {
    try {
      const res: any = await getSchedulers();
      const schedulerRows = res?.data || [];

      const schedulerMap = schedulerRows.reduce((acc: any, row: any) => {
        // Filter valid platforms
        const filtered = validPlatforms.reduce((obj: any, key: string) => {
          obj[key] = row[key] ?? null;
          return obj;
        }, {});

        acc[row.COUNTRY_ID] = {
          ...row,
          ...filtered,
        };

        return acc;
      }, {});

      const merged = countries.map((c) => {
        const sched = schedulerMap[c.id];
        return {
          COUNTRY_ID: c.id,
          COUNTRY_NAME: c.country_name,
          YOUTUBE: sched?.YOUTUBE ?? null,
          FACEBOOK: sched?.FACEBOOK ?? null,
          INSTAGRAM: sched?.INSTAGRAM ?? null,
          TIKTOK: sched?.TIKTOK ?? null,
          status: sched?.STATUS ?? "INACTIVE",
          rowExists: sched ? true : false,
        };
      });
      setCountryScheduler(merged);
      setCountrySchedulerCopy(JSON.stringify(merged));
    } catch (e) {
      console.error(e);
    }
  };

  const loadJoiningWords = async () => {
    try {
      const res = await getActiveJoiningWords();
      setJoininWords(
        res?.data?.map((row: any) => ({
          value: row.id,
          label: row.joining_word,
        })),
      );
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmitSources = async () => {
    const oldSources = JSON.parse(sourcesCopy);
    const changedSources = sources.filter((source: any) => {
      const old = oldSources.find((o: any) => o.id === source.id);
      if (!old) return true;
      return (
        source.article_count !== old.article_count ||
        source.sequence !== old.sequence ||
        source.type !== old.type ||
        source.joining_words !== old.joining_words ||
        source.intro_music_path !== old.intro_music_path
      );
    });

    const payload = changedSources.map((source: any) => {
      const row = {
        ...source,
        joining_words:
          source?.joining_words == "" ? null : parseInt(source?.joining_words),
        jarayid_source_id: source?.id,
        jarayid_country_id: selectedCountryId
          ? parseInt(selectedCountryId)
          : null,
        id: source?.source_id,
      };
      delete row?.status;
      delete row?.source_id;
      return row;
    });

    try {
      const res = await updateSources({ items: payload });
      const responseJson = await res.json();
      if (!res.ok || res.status !== 200 || responseJson?.statusCode !== 200) {
        throw new Error("Error occured");
      }
      toast.success(responseJson?.message);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmitScheduler = async () => {
    const oldScheduler = JSON.parse(countrySchedulerCopy);
    const changed = countryScheduler.filter((row: any) => {
      const old = oldScheduler.find(
        (o: any) => o.COUNTRY_ID === row.COUNTRY_ID,
      );
      if (!old) return true;

      for (const platform of validPlatforms) {
        if (row[platform] !== old[platform]) {
          return true;
        }
      }

      return false;
    });

    console.log(changed);
  };

  const toggleSourceStatus = async (row: any) => {
    try {
      let res = null;
      // update
      if (row?.source_id) {
        const payload = {
          id: row?.source_id,
          jarayid_rss_source_id: row?.jarayid_rss_source_id,
          status: row?.status === "INACTIVE" ? "ACTIVE" : "INACTIVE",
        };
        res = await updateSource(payload);
        if (res) {
          const responseJson = await res.json();

          if (
            !res.ok ||
            res.status !== 200 ||
            responseJson?.statusCode !== 200
          ) {
            throw new Error("Error occured");
          }
          toast.success(responseJson?.message);
          const updatedSources = [...sources].map((s) =>
            s.id === row.id ? { ...row, status: payload.status } : s,
          ) as never[];
          setSources(updatedSources);
          setSourcesCopy(JSON.stringify(updatedSources));
        } else {
          throw Error("Error Occured");
        }
      }
      // create
      else {
        const payload = {
          jarayid_country_id: selectedCountryId,
          jarayid_source_id: row?.id,
          operator: operator,
        };
        res = await createSource(payload);
        if (res) {
          const responseJson = await res.json();

          if (
            !res.ok ||
            res.status !== 201 ||
            responseJson?.statusCode !== 200
          ) {
            throw new Error("Error occured");
          }
          const updatedSources = [...sources].map((s) =>
            s.id === row.id
              ? { ...row, status: "ACTIVE", source_id: responseJson?.data?.id }
              : s,
          ) as never[];
          setSources(updatedSources);
          setSourcesCopy(JSON.stringify(updatedSources));
          toast.success(responseJson?.message);
        } else {
          throw Error("Error Occured");
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const toggleSchedule = async (row: any) => {
    try {
      let res = null;
      // update
      if (row?.rowExists) {
        const payload = {
          country_id: row?.COUNTRY_ID,
          status: row?.status === "INACTIVE" ? "ACTIVE" : "INACTIVE",
          operator: operator,
        };
        res = await updateSchedule(payload);
        if (res) {
          const responseJson = await res.json();

          if (
            !res.ok ||
            res.status !== 200 ||
            responseJson?.statusCode !== 200
          ) {
            throw new Error("Error occured");
          }
          toast.success(responseJson?.message);
          const updatedSchedulers = countryScheduler.map((s) =>
            s.COUNTRY_ID === row.COUNTRY_ID
              ? { ...row, status: payload.status }
              : s,
          );
          setCountryScheduler(updatedSchedulers);
          setCountrySchedulerCopy(JSON.stringify(updatedSchedulers));
        } else {
          throw Error("Error Occured");
        }
      }
      // create
      else {
        const payload = {
          schedulers: [
            {
              country_id: row?.COUNTRY_ID,
              operator: operator,
              key: "UPLOAD_TIME",
              value: null,
              platform: "YOUTUBE",
            },
            {
              country_id: row?.COUNTRY_ID,
              operator: operator,
              key: "UPLOAD_FREQUENCY",
              value: null,
              platform: "YOUTUBE",
            },
          ],
        };
        res = await createScheduler(payload);
        if (res) {
          const responseJson = await res.json();

          if (
            !res.ok ||
            res.status !== 201 ||
            responseJson?.statusCode !== 201
          ) {
            throw new Error("Error occured");
          }
          toast.success(responseJson?.message);
          const updatedSchedulers = countryScheduler.map((s) =>
            s.COUNTRY_ID === row.COUNTRY_ID
              ? { ...row, status: "ACTIVE", rowExists: true }
              : s,
          );
          setCountryScheduler(updatedSchedulers);
          setCountrySchedulerCopy(JSON.stringify(updatedSchedulers));
        } else {
          throw Error("Error Occured");
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    loadCountries();
    loadJoiningWords();
  }, []);

  useEffect(() => {
    if (countries?.length > 0 && isCountriesAPICalled) {
      loadScheduler();
    }
  }, [countries, isCountriesAPICalled]);

  useEffect(() => {
    if (selectedCountryId) {
      loadSavedSources().then(() => {
        setTimeout(() => {
          sourcesRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      });
    }
  }, [selectedCountryId]);

  const canSubmitSources = useMemo(() => {
    return JSON.stringify(sources) !== sourcesCopy;
  }, [sources]);

  const canSubmitScheduler = useMemo(() => {
    return JSON.stringify(countryScheduler) !== countrySchedulerCopy;
  }, [countryScheduler]);

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Countries & Sources
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Select a country to view and manage its news sources
          </p>
        </div>
      </div>

      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Countries</CardTitle>
          <div className="text-xs text-muted-foreground">
            {countries.length} Countries
          </div>
        </CardHeader>
        <CardContent>
          <CountriesTable
            countries={countries}
            setCountries={setCountries}
            setSelectedCountryId={setSelectedCountryId}
            openEditCountry={(id: number) => {}}
          />
        </CardContent>
      </Card>

      {selectedCountryId && (
        <div ref={sourcesRef}>
          <SourcesTable
            countryId={selectedCountryId}
            countries={countries}
            countrySources={sources}
            setCountrySources={setSources}
            reloadSources={loadSavedSources}
            canSubmit={canSubmitSources}
            joiningWords={joininWords}
            handleSubmit={handleSubmitSources}
            toggleStatus={toggleSourceStatus}
          />
        </div>
      )}

      <QuickScheduler
        countries={countries}
        scheduler={countryScheduler}
        setScheduler={setCountryScheduler}
        canSubmitScheduler={canSubmitScheduler}
        handleSubmit={handleSubmitScheduler}
        toggleSchedule={toggleSchedule}
      />
    </div>
  );
}
