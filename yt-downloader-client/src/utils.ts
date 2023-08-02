import { saveAs } from "file-saver";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

const qualityMap = {
    "360p": 18,
    "720p": "highestvideo",
    "128kbps": "highestaudio"
}

export const downloadVideo = async (videoUrl: string, type: string, quality: string) => {
    // @ts-ignore
    const _quality = qualityMap[quality];
    const url = `${BASE_URL}/api/download?url=${videoUrl}&type=${type}&quality=${_quality}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Error downloading video");
    const uuid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    const fileName= type === "video" ? `video-${uuid}.mp4` : `audio-${uuid}.mp3`;
    const blobType = type === "video" ? "video/mp4" : "audio/mp3";

    const blob = await res.blob();
    const newBlob = new Blob([blob], { type: blobType});
    saveAs(newBlob, fileName);
}
