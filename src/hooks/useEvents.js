import { useState, useCallback } from "react";
import { searchEvents } from "../api/eventsApi";

const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async ({ keyword = "", city = "" } = {}) => {
    setLoading(true);
    const res = await searchEvents({ keyword, city });
    console.log("res",res);
    
    setEvents(res);
    setLoading(false);
    return res;
  }, []);

  return { events, loading, fetch, setEvents };
}

export default  useEvents;