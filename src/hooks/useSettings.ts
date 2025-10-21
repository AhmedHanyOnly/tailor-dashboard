import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSettings, updateSettings, SiteSettings } from "@/api/methods/settings";

export function useSettings() {
  const queryClient = useQueryClient();

  // جلب الإعدادات
  const settingsQuery = useQuery<SiteSettings>({
    queryKey: ["settings"],
    queryFn: getSettings,
    staleTime: 1000 * 60, // دقيقة واحدة
  });

  // تحديث الإعدادات
  const updateMutation = useMutation({
    mutationFn: (data: Partial<SiteSettings>) => updateSettings(data),
    onSuccess: () => queryClient.invalidateQueries(["settings"]),
  });

  return {
    settingsQuery,
    updateMutation,
  };
}
