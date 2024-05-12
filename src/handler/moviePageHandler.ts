import { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import moviePageServiceOd from "service/otakudesuProvider/moviePageService";

class moviePageHandler {
  static getHomePageMovieList = async (c: Context) => {
    try {

      const responseData = await moviePageServiceOd.getHomePageMovieListOd();

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

  static getMovieEpisodeLists = async (c: Context) => {
    try {

      const responseData = await moviePageServiceOd.getMovieEpisodeListsOd();

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

  static getMovieVideoPlay = async (c: Context) => {
    try {

      const responseData = await moviePageServiceOd.getMovieVideoPlayOd();

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

  static getSearchMovies = async (c: Context) => {
    try {
      const dataQuery = c.req.query("q");

      if (!dataQuery) {
        return c.json({ message: "Please insert data on query ?q= !" }, 400);
      }

      const responseData = await moviePageServiceOd.getSearchMovieListOd(dataQuery);

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
}

export default moviePageHandler;
