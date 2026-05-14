import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation, useSearchParams } from "react-router-dom";
import { practiceApi } from "@/api/practice.api";
import { useMemo } from "react";
import { PracticeTestDTO } from "@/data/practices/practice.types";

export const usePracticeTest = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const mode = (location.state?.mode as "exam" | "practice") || "practice";
  const rawUnit = searchParams.get("unit");
  const unitNumber = rawUnit === "full" ? null : Number(rawUnit || 1);

  const { data: test, isLoading, error } = useQuery({
    queryKey: ["practice-test", id],
    queryFn: async () => {
      if (!id) throw new Error("Test ID is required");
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
