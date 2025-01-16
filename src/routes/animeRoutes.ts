import otakudesuPageHandler from "handler/otakudesuPageHandler.ts";
import { Hono } from "hono";

const animeRoutes = new Hono();

animeRoutes.get("/otakudesu/homepage", (c) => otakudesuPageHandler.getHomePageAnimeList(c));
animeRoutes.get("/otakudesu/searchanime", (c) => otakudesuPageHandler.getSearchAnimes(c))
animeRoutes.get("/otakudesu/getanime/:judulAnime", (c) => otakudesuPageHandler.getAnimeEpisodeLists(c))
animeRoutes.get("/otakudesu/animesource/:urlAnimeEps", (c) => otakudesuPageHandler.getAnimeVideoPlay(c))
animeRoutes.get("/otakudesu/animegenre/:genre/pages/:pageNumber", (c) => otakudesuPageHandler.getAnimeGenre(c))
animeRoutes.get("/otakudesu/ongoin-anime/page/:pageNumber", (c) => otakudesuPageHandler.getOngoingAnimeList(c))

export default animeRoutes;
