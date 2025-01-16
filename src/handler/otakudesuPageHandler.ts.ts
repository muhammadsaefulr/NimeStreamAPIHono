import { Context } from "hono";
import AnimePageServiceOd from "service/otakudesuProvider/animePageService";

class otakudesuPageHandler {
  static getHomePageAnimeList = async (c: Context) => {
    try {
      const responseData = await AnimePageServiceOd.getHomePageAnimeListOd();

      if (!responseData) {
        return c.json({ message: "Data Tidak Ditemukan !" }, 404);
      }

      return c.json(
        {
          status: 200,
          message: "Berhasil Mengambil Data !",
          data: responseData,
        },
        200
      );
    } catch (e) {
      throw new Error(`${e}`);
    }
  };

  static getAnimeGenre = async (c: Context) => {
    try {
      const { genre, pageNumber } = c.req.param();

      const responseData = await AnimePageServiceOd.getGenreAnimeListsOd(genre, pageNumber);

      if (!responseData) {
        return c.json({ message: "Data Tidak Ditemukan !" }, 404);
      }

      return c.json(
        {
          status: 200,
          message: "Berhasil mengambil data !",
          data: responseData,
        },
        200
      );
    } catch (e) {
      throw new Error(`${e}`);
    }
  };

  static getAnimeEpisodeLists = async (c: Context) => {
    try {
      const pathname = c.req.param("judulAnime");
      const responseData = await AnimePageServiceOd.getAnimeEpisodeListsOd(
        pathname
      );

      if (!responseData) {
        return c.json({ message: "Data Tidak Ditemukan !" }, 404);
      }

      return c.json(
        {
          status: 200,
          message: "Berhasil Mengambil Data !",
          path: pathname,
          data: {
            dataInfo: responseData.AnimeInfo,
            dataEps: responseData.AnimeEps,
          },
        },
        200
      );
    } catch (e) {
      throw new Error(`${e}`);
    }
  };

  static getAnimeVideoPlay = async (c: Context) => {
    try {
      const { pathname } = c.req.param();
      const responseData = await AnimePageServiceOd.getAnimeVideoPlayOd(
        pathname!
      );

      if (!responseData) {
        return c.json({ message: "Data Tidak Ditemukan !" }, 404);
      }

      return c.json(
        {
          status: 200,
          message: "Berhasil Mengambil Data !",
          responseData,
        },
        200
      );
    } catch (e) {
      throw new Error(`${e}`);
    }
  };

  static getSearchAnimes = async (c: Context) => {
    try {
      const dataQuery = c.req.query("judul");

      if (!dataQuery) {
        return c.json({ message: "Please insert data on query ?q= !" }, 400);
      }

      const responseData = await AnimePageServiceOd.getSearchAnimeListOd(
        dataQuery
      );

      if (!responseData) {
        return c.json({ message: "Data Tidak Ditemukan !" }, 404);
      }

      return c.json(
        {
          status: 200,
          message: "Berhasil Mengambil Data !",
          data: responseData,
        },
        200
      );
    } catch (e) {
      throw new Error(`${e}`);
    }
  };


static getOngoingAnimeList = async (c: Context) => {
  try {
    const pathpageNumber = c.req.param("pageNumber");

    if (!pathpageNumber || isNaN(parseInt(pathpageNumber))) {
      return c.json({ message: "Invalid Page Number !" }, 400);
    }

    const responseData = await AnimePageServiceOd.getOngoingAnimeListOd(parseInt(pathpageNumber));

    if (!responseData) {
      return c.json({ message: "Data Tidak Ditemukan !" }, 404);
    }

    return c.json(
      {
        status: 200,
        message: "Berhasil Mengambil Data !",
        data: responseData,
      },
      200
    );
  } catch (e) {
    throw new Error(`${e}`);
  }
}
};

export default otakudesuPageHandler;
