import WebScraperOtakudesu from "utils/scrapper/otakudesu/readCustomProvider";

class AnimePageServiceOd {

  static async getHomePageAnimeListOd() {
    const data = await WebScraperOtakudesu.scrapeHomePage();

    return data;
  }

  static async getGenreAnimeListsOd(pathname: string, page: string) {
    const dataPath = `genres/${pathname}/page/${page}`
    const data = await WebScraperOtakudesu.scrapeGenreAnimes(dataPath)

    return data
  }

  static async getAnimeEpisodeListsOd(pathname: string){
    const dataPath = `anime/${pathname}`
    const data = await WebScraperOtakudesu.scrapeAnimeEpisodes(dataPath)

    return data;
  }

  static async getOngoingAnimeListOd(pageNumber: number){
    const urls = `ongoing-anime/page/${pageNumber}`
    const data = await WebScraperOtakudesu.scrapeOngoingAnime(urls)

    return data
  }

  static async getAnimeVideoPlayOd(pathname: string){
    const dataPath = `episode/${pathname}`
    const data = await WebScraperOtakudesu.scrapeVideoAnimeSource(dataPath)
    console.log(data)

    return data
  }

  static async getSearchAnimeListOd(query: string) {
    const dataQuery = `?s=${query}&post_type=anime`
    const data = await WebScraperOtakudesu.scrapeSearchAnimeByTitle(dataQuery)

    return data
  }
}

export default AnimePageServiceOd;
