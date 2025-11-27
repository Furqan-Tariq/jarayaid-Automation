"use client";

import { useEffect, useState } from "react";
import { Plus, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchJson } from "@/lib/fetchJson";
import CountryDialog from "./components/CountryDialog";
import CountriesTable from "./components/CountriesTable";
import SourcesTable from "./components/SourcesTable";
import QuickScheduler from "./components/QuickScheduler";
import { getAll } from "./service";

type CountryDropdown = { id: number; name: string; arabicname?: string };
type SavedCountry = {
  id: number;
  name: string;
  slug?: string;
  enabled?: boolean;
  status?: "Manual" | "Auto";
};

export default function CountriesSourcesPage() {
  const [dropdownCountries, setDropdownCountries] = useState<CountryDropdown[]>(
    [],
  );
  const [countries, setCountries] = useState<SavedCountry[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(
    null,
  );

  const [countryDialogOpen, setCountryDialogOpen] = useState(false);
  const [editingCountryId, setEditingCountryId] = useState<number | null>(null);

  // Sources map: countryId => array of sources
  const [countrySources, setCountrySources] = useState<Record<number, any[]>>(
    {},
  );

  const loadDropdownCountries = async () => {
    try {
      const res: any = await fetchJson("admin-dashboard/getCountries");
      setDropdownCountries(res?.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const loadSavedCountries = async () => {
    try {
      const res: any = await getAll();
      setCountries(res?.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadDropdownCountries();
    loadSavedCountries();
  }, []);

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
        <CountryDialog
          open={countryDialogOpen}
          setOpen={setCountryDialogOpen}
          dropdownCountries={dropdownCountries}
          editingCountryId={editingCountryId}
          onSaved={loadSavedCountries}
          savedCountries={countries}
        >
          <Button className="gap-2 bg-accent hover:bg-accent/90">
            <Plus size={18} />
            Add Country
          </Button>
        </CountryDialog>
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
            openEditCountry={(id: number) => {
              setEditingCountryId(id);
              setCountryDialogOpen(true);
            }}
          />
        </CardContent>
      </Card>

      {selectedCountryId && (
        <SourcesTable
          countryId={selectedCountryId}
          countries={countries}
          countrySources={countrySources}
          setCountrySources={setCountrySources}
        />
      )}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Quick Scheduler</CardTitle>
        </CardHeader>
        <CardContent>
          <QuickScheduler countries={countries} />
        </CardContent>
      </Card>
    </div>
  );
}
