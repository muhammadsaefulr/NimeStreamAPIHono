import { CheerioAPI, load } from "cheerio";
import mainService, {
  pdrainExtractorServicePromise,
} from "service/mainService/mainService";
import PdrainExtractorService from "./PdreainExtractor";
import axios from "axios";

const url = "https://otakudesu.cloud/";
const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
  'Cache-Control': 'max-age=0',
};


class WebScraperOtakudesu {
  private static async fetchHtml(url: string): Promise<string> {
    const response = await axios.get(url, { headers });
    return await response.data;
  }

  private static async cheerioInstance(pathUri: string): Promise<CheerioAPI> {
    const html = await this.fetchHtml(url + pathUri);
    const datas = load(html);

    return datas;
  }

  static async scrapeHomePage(): Promise<any[]> {
    const $ = await this.cheerioInstance("");
    let datas: any[] = [];

    $(".venz li").each((i, el) => {
      const anime = {
        episode: $(el).find(".epz").text().trim(),
        dayUpdate: $(el).find(".epztipe").text().trim(),
        dateUpdate: $(el).find(".newnime").text(),
        url: $(el).find(".thumb a").attr("href") || "",
        imageUrl: $(el).find(".thumb img").attr("src") || "",
        title: $(el).find(".jdlflm").text().trim(),
      };

      datas.push({
        title: anime.title,
        url: anime.url,
        thumbnailUrl: anime.imageUrl,
        latestEp: anime.episode,
        updateAnime: anime.dayUpdate,
      });
    });

    return datas;
  }

  static async scrapeGenreAnimes(pathUri: string) {
    const $ = await this.cheerioInstance(pathUri);

    let AnimeList: any[] = [];

    $(".col-anime").each((i, el) => {
      const dataAnime = {
        animeTitle: $(el).find(".col-anime-title a").text().trim(),
        animeLinks: $(el).find(".col-anime-title a").attr("href"),
        animeStudio: $(el).find(".col-anime-studio").text().trim(),
        animeEpsAvailable: $(el).find(".col-anime-eps").text().trim(),
        animeRating: $(el).find(".col-anime-rating").text().trim(),
      };
      AnimeList.push(dataAnime);
    });

    return AnimeList.slice(0, 20);
  }

  static async scrapeAnimeEpisodes(
    pathUri: string
  ): Promise<{ AnimeInfo: any[]; AnimeEps: any[] }> {
    const $ = await this.cheerioInstance(pathUri);
    let AnimeInfo: any[] = [];
    let AnimeEps: any[] = [];

    $(".infozingle").each((i, el) => {
      const genres: any[] = $(el)
        .find('span b:contains("Genre")')
        .parent()
        .find("a")
        .map((i, e) => ({
          genre: $(e).text(),
          genreLinks: $(e).attr("href"),
        }))
        .get();

      const sinopsis = $(".sinopc").find("p").text();

      const dataDetails = {
        thumbnailImage: $(".fotoanime img").attr("src"),
        title: $(el).find('p:contains("Judul")').text().replace("Judul: ", ""),
        rating: $(el).find('p:contains("Skor")').text().replace("Skor: ", ""),
        producer: $(el)
          .find('p:contains("Produser")')
          .text()
          .replace("Produser: ", ""),
        status: $(el)
          .find('p:contains("Status")')
          .text()
          .replace("Status: ", ""),
        totalEps: $(el)
          .find('p:contains("Total Episode")')
          .text()
          .replace("Total Episode: ", ""),
        duration: $(el)
          .find('p:contains("Durasi")')
          .text()
          .replace("Durasi: ", "")
          .replace("per ep.", ""),
        studio: $(el)
          .find('p:contains("Studio:")')
          .text()
          .replace("Studio: ", ""),
        releaseDate: $(el).find('p:contains("Tanggal Rilis")').text(),
        genre: genres,
        sinopsis: sinopsis,
      };

      AnimeInfo.push(dataDetails);
    });

    $(".episodelist li").each((i, el) => {
      const AnimeList = {
        title: $(el).find("span a").text().trim(),
        vidLinks: $(el).find("span a").attr("href"),
      };

      AnimeEps.push(AnimeList);
    });

    return { AnimeInfo, AnimeEps };
  }

  static async scrapeSearchAnimeByTitle(pathUri: string): Promise<any[]> {
    const $ = await this.cheerioInstance(pathUri);
    const AnimeList: any[] = [];

    $("ul.chivsrc li").each((i, el) => {
      const genres: any[] = [];
      $(el)
        .find('.set b:contains("Genres")')
        .parent()
        .find("a")
        .each((i, genre) => {
          const data = {
            titleGenre: $(genre).text(),
            genreLinks: $(genre).attr("href"),
          };
          genres.push(data);
        });

      const resultList = {
        title: $(el).find("h2 a").text(),
        AnimeLinks: $(el).find("h2 a").attr("href"),
        AnimeThumbnail: $(el).find("img").attr("src"),
        status: $(el)
          .find(".set b:contains('Status')")
          .parent()
          .text()
          .trimStart(),
        rating: $(el).find(".set b:contains('Rating')").parent().text(),
      };

      AnimeList.push(...AnimeList, {
        title: resultList.title,
        thumbnailImage: resultList.AnimeThumbnail,
        AnimeLinks: resultList.AnimeLinks,
        genre: genres,
        status: resultList.status,
        rating: resultList.rating,
      });
    });

    return AnimeList.slice(0, 15);
  }

  static async scrapeOngoingAnime(pathUri: string): Promise<any> {
    const $ = await this.cheerioInstance(pathUri);
    const dataInfo: any[] = []
    
    $('.venz li').each((i, el) => {
      const data = {
        title: $(el).find('.jdlflm').text(),
        epsNow: $(el).find('.epz').text(),
        AnimeLinks: $(el).find('.thumb a').attr('href'),
        updateAnime: $(el).find('.epztipe').text(),
        thumbnailImage: $(el).find('.thumbz img').attr('src'),
      };
      dataInfo.push(data);
    });

    return dataInfo.slice(0, 15)
  }

  static async scrapeVideoAnimeSource(pathUri: string): Promise<any> {
    const $ = await this.cheerioInstance(pathUri);
    console.log($, pathUri)
    let data = {};
    let AnimeSource: any[] = [];
    let epsList: any[] = [];

    $('.keyingpost li').each((i, el) => {
      const data = {
        title: $(el).find('a').text(),
        links: $(el).find('a').attr('href'),
      };

      epsList.push(data);
    });

    $('.download ul li').each((i, el) => {
      const dataList: any[] = [];
      let titleRes = $(el).find('strong').text();
      $(el)
        .find('a')
        .each((i, el) => {
          let title = $(el).text();
          let links = $(el).attr('href');
          dataList.push({ title, links });
        });
      AnimeSource.push({ res: titleRes, dataList });
    });

    let partsSliced = $('.venutama')
      .find('h1.posttl')
      .text()
      .split(/^(.*?)\s(Episode\s\d+\sSubtitle\sIndonesia)$/i);

    const dataSource = {
      judulAnime: partsSliced[1],
      epsNow: partsSliced[2],
      nextEpsLinks: $('.flir').find("a:contains('Next Eps.')").attr('href'),
      releaseOn: $('.kategoz')
        .find("span:contains('Release on')")
        .text()
        .replace('Release on', ''),
      vidSourceLinks: $('.responsive-embed-stream iframe').attr('src'),
    };
    data = {
      title: dataSource.judulAnime,
      releaseOn: dataSource.releaseOn,
      epsNow: dataSource.epsNow,
      sourceLinks: dataSource.vidSourceLinks,
      nextEpsLinks: dataSource.nextEpsLinks,
      AnimeSource,
    };

    const pdrainSource = AnimeSource.filter((source) =>
      /(mp4|0p)/i.test(source.res.toLowerCase()),
    )
      .map((source) => {
        const filteredDataList = source.dataList.filter(
          (item: any) => item.title.trim().toLowerCase() === 'pdrain',
        );
        return filteredDataList.length > 0
          ? { resolution: source.res, link: filteredDataList[0].links.trim() }
          : null;
      })
      .filter((link) => link !== null);

    const resultPdrain: any[] = [];
    for (const datapdrain of pdrainSource) {
      const result = await PdrainExtractorService.extractUrl(datapdrain.link);
      if (result !== null) {
        let res = datapdrain.resolution;
        let links = result;

        resultPdrain.push({ res, links });
      }
    }

    data = { ...data, epsList, resultPdrain };
    return data;
  }
}

export default WebScraperOtakudesu;
