"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchJson } from "@/lib/fetchJson";
import CountriesTable from "./components/CountriesTable";
import SourcesTable from "./components/SourcesTable";
import QuickScheduler from "./components/QuickScheduler";
import { getAll, getSchedulers, getSourcesByCountryID } from "./service";
import useGetCategories from "@/hooks/useGetCategories";

type SavedCountry = {
  id: number;
  country_name: string;
  // enabled?: boolean;
  // status?: "Manual" | "Auto";
};

const validPlatforms = ["TIKTOK", "FACEBOOK", "INSTAGRAM", "YOUTUBE"];

export default function CountriesSourcesPage() {
  const [countries, setCountries] = useState<SavedCountry[]>([]);
  const [countryScheduler, setCountryScheduler] = useState<any[]>([]);
  const [countrySchedulerCopy, setCountrySchedulerCopy] = useState("");
  const [sources, setSources] = useState([]);
  const [sourcesCopy, setSourcesCopy] = useState("");
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(
    null,
  );
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
        acc[item.country_id] = item.status;
        return acc;
      }, {});
      const mapped: SavedCountry[] = res.map((c: any) => ({
        id: c.id,
        country_name: c.name,
        status: activeMap[c.id] ?? "INACTIVE",
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
        type: activeMap[row?.ID]?.sequence || "",
      }));

      setSources(sources || []);
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
          COUNTRY_ID: row.COUNTRY_ID,
          COUNTRY_NAME: row.COUNTRY_NAME,
          ...filtered,
        };

        return acc;
      }, {});

      const merged = countries.map((c) => {
        const sched = schedulerMap[c.id];
        return (
          sched || {
            COUNTRY_ID: c.id,
            COUNTRY_NAME: c.country_name,
            YOUTUBE: null,
            FACEBOOK: null,
            INSTAGRAM: null,
            TIKTOK: null,
          }
        );
      });

      setCountryScheduler(merged);
      setCountrySchedulerCopy(JSON.stringify(merged));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmitSources = async () => {
    const oldSources = JSON.parse(sourcesCopy);
    const changedSources = sources.filter((source: any) =>
      oldSources.some(
        (oldSource: any) =>
          source.article_count !== oldSource.article_count ||
          source.sequence !== oldSource.sequence,
      ),
    );
  };

  const handleSubmitScheduler = async () => {
    const oldScheduler = JSON.parse(countrySchedulerCopy);
    const changed = countryScheduler.filter((row: any) => {
      const old = oldScheduler.find(
        (o: any) => o.COUNTRY_ID === row.COUNTRY_ID,
      );
      if (!old) return true;

      // Check platform fields (time + frequency)
      for (const platform of validPlatforms) {
        if (row[platform] !== old[platform]) {
          return true;
        }
      }

      return false;
    });
    
    console.log(changed);
  };

  useEffect(() => {
    loadCountries();
  }, []);

  useEffect(() => {
    if (countries?.length > 0 && isCountriesAPICalled) {
      loadScheduler();
    }
  }, [countries, isCountriesAPICalled]);

  useEffect(() => {
    if (selectedCountryId) {
      loadSavedSources();
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
        <SourcesTable
          countryId={selectedCountryId}
          countries={countries}
          countrySources={sources}
          setCountrySources={setSources}
          reloadSources={loadSavedSources}
          canSubmit={canSubmitSources}
          handleSubmit={handleSubmitSources}
        />
      )}

      <QuickScheduler
        countries={countries}
        scheduler={countryScheduler}
        setScheduler={setCountryScheduler}
        canSubmitScheduler={canSubmitScheduler}
        handleSubmit={handleSubmitScheduler}
      />
    </div>
  );
}
