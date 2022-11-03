import { useEffect, useState } from "react";

import axios from "axios";

import { BASE_URL } from "./utils";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    axios({
      url: `${BASE_URL}/`,
      method: "GET",
      params: {
        delta_hours: 24,
      },
    }).then((res) => {
      setVideos(res.data.payload);
      setLoading(false);
    });
  }, []);

  const fetchMore = () => {
    axios({
      url: `${BASE_URL}/`,
      method: "POST",
      params: {
        q: "BGMI Giveaway",
        save: 1,
      },
    }).then(() => window.location.reload());
  };

  const refresh = (video) => {
    window.location.reload();
  };

  const postVideo = (video) => {
    axios({
      url: `${BASE_URL}/post/${video.pk}`,
      method: "GET",
    }).then((res) => {
      const updatedVideos = videos.map((video, index) => {
        if (video.pk === res.data.pk) {
          return res.data;
        }
        return video;
      });
      setVideos(updatedVideos);
    });
  };

  const deleteVideo = (video) => {
    axios({
      url: `${BASE_URL}/${video.pk}`,
      method: "DELETE",
    }).then((res) => {
      const updatedVideos = videos.filter((i) => i.pk !== video.pk);
      setVideos(updatedVideos);
    });
  };

  return (
    <div>
      <button onClick={refresh}>Refresh</button>
      <button onClick={fetchMore}>Fetch More</button>

      <p>
        <b>Total: </b>
        {videos.length}
      </p>

      {loading
        ? "loading.."
        : videos.map((video, index) => (
            <div
              key={index}
              style={{
                backgroundColor: video.is_posted ? "orange" : "green",
                color: "white",
                fontWeight: "bold",
                padding: "5px 5px 10px 5px",
                borderBottom: "2px solid #000",
              }}
            >
              <p>
                <b>#{index}</b> {video.video_title}
              </p>
              <p>
                <b>{video.channel_name}</b>
              </p>
              <a href={video.video_url} target="_blank" rel="noreferrer">
                <button>Play</button>
              </a>
              <button onClick={() => postVideo(video)}>Post</button>
              <button onClick={() => deleteVideo(video)}>Delete</button>
            </div>
          ))}
    </div>
  );
}
