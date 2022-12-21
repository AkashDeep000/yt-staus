import { error } from "@sveltejs/kit";
import ytdl from "ytdl-core";

export async function GET({ url }) {
  const videoUrl = url.searchParams.get("url");
  const info = await ytdl.getInfo(ytdl.getURLVideoID(videoUrl));
  const videoFormats = ytdl.filterFormats(info.formats, "videoandaudio");
  videoFormats.sort((a, b) => b.itag - a.itag);
  const downloadUrl = new URL(videoFormats[0].url);
  const host = downloadUrl.host;
  downloadUrl.host = "redirector.googlevideo.com";
  downloadUrl.searchParams.append("host", host);
  downloadUrl.searchParams.append("title", "Success");

  const data = {
    title: info.videoDetails.title,
    videoId: info.videoDetails.videoId,
    thumb: info.videoDetails.thumbnails,
    duration: info.videoDetails.lengthSeconds,
    views: info.videoDetails.viewCount,
    downloadUrl: downloadUrl.toString(),
  };

  const res = JSON.stringify(data, null, 2);
  return new Response(res, {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
}
