import { useEffect, useState } from "react";

export function useUserTimeZone() {
  const [timeZone, setTimeZone] = useState<string>("");

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimeZone(tz);
  }, []);

  return timeZone;
}
