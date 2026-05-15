import { useQuery } from "@tanstack/react-query";
import { useRoute } from "@react-navigation/native";
import { practiceApi } from "@/api/practice.api";
import { useMemo } from "react";
import { PracticeTestDTO } from "@/data/practices/practice.types";

export const usePracticeTest = () => {
  const route = useRoute<any>();
  const { id, unit: rawUnit, mode: initialMode } = route.params || {};

  const mode = (initialMode as "exam" | "practice") || "practice";
  const unitNumber = rawUnit === "full" ? null : Number(rawUnit || 1);

  const { data: test, isLoading, error } = useQuery({
    queryKey: ["practice-test", id],
    queryFn: async () => {
      if (!id) throw new Error("Test ID is required");
      // Sử dụng getSkillPreview hoặc getTestPreview tùy theo loại ID
      const res = await practiceApi.getSkillPreview(id);
      return res.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const currentUnit = useMemo(() => {
    if (!test) return null;

    const isReading = !!test.content?.passages;
    const isListening = !!test.content?.sections;

    if (isReading && test.content.passages) {
      return (
        test.content.passages.find((p) => p.passage_number === unitNumber) ||
        test.content.passages[0]
      );
    }

    if (isListening && test.content.sections) {
      return (
        test.content.sections.find((s) => s.section === unitNumber) ||
        test.content.sections[0]
      );
    }

    return null;
  }, [test, unitNumber]);

  return {
    test,
    currentUnit,
    isLoading,
    error,
    mode,
    id,
  };
};
