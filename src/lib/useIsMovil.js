import { useEffect, useState } from "react";

export default function useIsMobile(bp = 768){
  const [m, setM] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width:${bp}px)`);
    const set = () => setM(mq.matches);
    set(); mq.addEventListener?.("change", set);
    return () => mq.removeEventListener?.("change", set);
  }, [bp]);
  return m;
}