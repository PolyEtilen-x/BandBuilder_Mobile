import { useQuery } from "@tanstack/react-query";
import { useRoute } from "@react-navigation/native";
import { practiceApi } from "@/api/practice.api";
import { useMemo } from "react";
import { PracticeTestDTO } from "@/data/practices/practice.types";
import { normalizeTestUnits } from "@/utils/normalizeTestUnits.utils";

export const usePracticeTest = () => {
  const route = useRoute<any>();
  const { id, unit: rawUnit, mode: initialMode } = route.params || {};

  const mode = (initialMode as "exam" | "practice") || "practice";
  const unitNumber = rawUnit === "full" ? null : Number(rawUnit || 1);

  const { data: test, isLoading, error } = useQuery({
    queryKey: ["practice-test", id],
    queryFn: async () => {
      if (!id || id === "undefined") throw new Error("Test ID is required");
      // Sử dụng getSkillPreview hoặc getTestPreview tùy theo loại ID
      const res = await practiceApi.getSkillPreview(id);
      return res.data;
    },
    enabled: !!id && id !== "undefined",
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const currentUnit = useMemo(() => {
    if (!test) return null;
    const units = normalizeTestUnits(test);
    return units.find((u) => u.id === unitNumber) || units[0] || null;
  }, [test, unitNumber]);

  return {
    test,
    currentUnit: currentUnit as any,
    isLoading,
    error,
    mode,
    id,
  };
};
