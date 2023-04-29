import React, { useState } from "react";

const OCRUploader = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handlePost = async () => {
    const url = "https://journal-scanner.herokuapp.com/";
    const data = new FormData();
    data.append("file", file);

    try {
      const response = await fetch(url, {
        method: "POST",
        body: data,
      });
      console.log(data);
      console.log("response", response);
      const text = await response.text();
      setResult(text);
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
