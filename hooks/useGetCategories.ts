import { fetchJson } from "@/lib/fetchJson";
import { useCallback } from "react";

type Categories = [
  {
    id: number,
    name: string,
    arabicname: string,
  }
]

const useGetCategories = () => {
  const getCategories = useCallback(async () => {
    const res: any = await fetchJson("admin-dashboard/getCategories");
    return res?.data?.filter((row: any) => row?.TYPE === "country")?.map((row: any) => ({
      id: row.ID,
      name: row.NAME,
      arabicname: row.ARABIC_NAME,
    })) as Categories
  }, []);
  return getCategories;
}

export default useGetCategories;
