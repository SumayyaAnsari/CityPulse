import { useState, useEffect, useCallback, useRef } from "react";
import { loadFavorites, saveFavorites } from "../services/storage";
import auth from "@react-native-firebase/auth";

const useFavorites = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const userEmailRef = useRef(auth().currentUser?.email || null);

  const computeFavoritesForEmail = useCallback((events, email) => {
    if (!email) return [];
    return events.filter((e) => Array.isArray(e.favoritedBy) && e.favoritedBy.includes(email));
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const events = await loadFavorites();
        if (!mounted) return;
        setAllEvents(events || []);
        const email = auth().currentUser?.email || null;
        userEmailRef.current = email;
        setFavorites(computeFavoritesForEmail(events || [], email));
      } catch (err) {
        if (mounted) {
          setAllEvents([]);
          setFavorites([]);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [computeFavoritesForEmail]);

  useEffect(() => {
    (async () => {
      try {
        await saveFavorites(allEvents);
      } catch (err) {
      }
    })();
  }, [allEvents]);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((u) => {
      const email = u?.email || null;
      userEmailRef.current = email;
      setFavorites(computeFavoritesForEmail(allEvents, email));
    });
    return unsubscribe;
  }, [allEvents, computeFavoritesForEmail]);

  const toggleFavorite = useCallback(
    async (event) => {
      const email = auth().currentUser?.email || null;
      if (!email) {
        return;
      }

      setAllEvents((prev) => {
        const next = prev.slice();
        const idx = next.findIndex((e) => String(e.id) === String(event.id));

        if (idx >= 0) {
          const existing = { ...next[idx] };
          const fav = Array.isArray(existing.favoritedBy) ? existing.favoritedBy.slice() : [];

          if (fav.includes(email)) {
            existing.favoritedBy = fav.filter((em) => em !== email);
          } else {
            existing.favoritedBy = [email, ...fav.filter((em) => em !== email)];
          }

          next[idx] = existing;
        } else {
          const toSave = { ...(event || {}), favoritedBy: [email] };
          next.unshift(toSave);
        }

        setFavorites(computeFavoritesForEmail(next, email));

        return next;
      });
    },
    [computeFavoritesForEmail]
  );

  const isFavorite = useCallback(
    (id) => {
      const email = auth().currentUser?.email || null;
      if (!email) return false;
      return favorites.some((f) => String(f.id) === String(id));
    },
    [favorites]
  );

  return { favorites, toggleFavorite, isFavorite, allEvents, setAllEvents };
}

export default useFavorites