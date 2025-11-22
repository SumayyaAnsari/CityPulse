import axios from "axios";

const API_KEY = "Y6BOa6hmC55GB9gC65pue5DcdzWjK9L3";
const BASE = "https://app.ticketmaster.com/discovery/v2";

export const searchEvents = async ({ keyword = "", city = "", page = 0 }) => {
  try {
    const params = {
      apikey: API_KEY,
      keyword,
      city,
      size: 20,
      page
    };
    const res = await axios.get(`${BASE}/events.json`, { params });
    console.log("res", res);
    
    const events = res.data?._embedded?.events ?? [];
    return events.map((e) => ({
      id: e.id,
      name: e.name,
      date: e.dates?.start?.dateTime || e.dates?.start?.localDate,
      url: e.url,
      images: e.images || [],
      venue: e._embedded?.venues?.[0]?.name ?? "",
      city: e._embedded?.venues?.[0]?.city?.name ?? ""
    }));
  } catch (err) {
    return [];
  }
};

export const getEventById = async (id) => {
  try {
    const res = await axios.get(`${BASE}/events/${id}.json`, {
      params: { apikey: API_KEY }
    });
    return res.data;
  } catch (err) {
    return null;
  }
};


