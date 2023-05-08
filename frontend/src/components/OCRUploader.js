import React, { useState } from "react";
import axios from "axios";

const OCRUploader = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handlePost = async () => {
    const data = new FormData();
    data.append("file", file);

    for (var pair of data.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
    try {
      const response = await axios.post(
        "https://journal-backend-o6sb.onrender.com/upload",
        // "http://localhost:3001/upload",
        data,
        {
          accept: "application/json",
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // await axios.post("http://localhost:3000/upload", {
      //   file: data,
      // });
      console.log("response", response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {file ? (
        <button onClick={handlePost}>Post</button>
      ) : (
        <p>Select an image file to upload</p>
      )}
      {result ? <pre>{result}</pre> : null}
    </div>
  );
};

export default OCRUploader;
