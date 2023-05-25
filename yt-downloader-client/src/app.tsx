import logo from './assets/ytLogo.svg'
import {useState} from "react";
import {downloadVideo} from "./utils.ts";
import Spinner from "./spinner.tsx";

const App = () => {
    const qualityOptions = ["720p", "360p"]

    const [url, setUrl] = useState("")
    const [type, setType] = useState("video")
    const [quality, setQuality] = useState("720p")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target.value)
    }

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setType(e.target.value)
        if (e.target.value === "audio") setQuality("128kbps")
    }

    const handleQualityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setQuality(e.target.value)
    }

    const handleDownload = () => {
        setLoading(true)
        downloadVideo(url, type, quality).then(() => {
            setLoading(false)
            setError(false)
        }).catch(() => {
            setError(true)
            setLoading(false)
        })
    }

    return (
        <div className="flex flex-col bg-gray-900 h-screen text-white items-center">
            <div className="flex flex-col gap-2 items-center mt-8">
                <img className="w-20" src={logo} alt="logo"/>
                <p className="font-semibold text-2xl">Youtube Downloader</p>
            </div>
            <div className="flex flex-col justify-center items-center mb-8">
                <input value={url} onChange={handleUrlChange} className="bg-gray-800 w-60 text-white rounded-lg p-2 mt-8" type="text" placeholder="Enter URL" />
                <div className="flex gap-2 w-full">
                    <select value={type} onChange={handleTypeChange} className="bg-gray-800 w-24 text-white rounded-lg p-2 mt-2" name="type" id="type">
                        <option value="video">Video</option>
                        <option value="audio">Audio</option>
                    </select>
                    {type === "video" && (
                        <select value={quality} onChange={handleQualityChange} className="bg-gray-800 w-24 text-white rounded-lg p-2 mt-2" name="quality" id="quality">
                            {qualityOptions.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    )}
                    {type === "audio" && (
                        <span className="flex-1" />
                    )}
                </div>
                <button onClick={handleDownload} className="bg-gray-800 w-60 text-white rounded-lg p-2 mt-2 hover:bg-gray-700">Download</button>
            </div>
            {loading && (
                <Spinner />
            )}
            {error && (
                <p className="text-red-500 mt-2">Error downloading video</p>
            )}
        </div>
    )
}

export default App
