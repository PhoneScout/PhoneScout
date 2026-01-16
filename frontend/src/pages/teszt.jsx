import React, { useState, useEffect } from "react";
import JSZip from "jszip";

function DisplayPhonePictures({ phoneID }) {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const loadPictures = async () => {
      try {
        // Fetch ZIP from backend
        const response = await fetch(`http://localhost:5175/api/blob/GetPicturesZip/${phoneID}`);
        if (!response.ok) {
          console.error("Pictures not found!");
          return;
        }

        const zipBlob = await response.blob();
        const zip = await JSZip.loadAsync(zipBlob);

        const urls = [];

        // Extract each file in the ZIP as a Blob URL
        zip.forEach((relativePath, file) => {
          file.async("blob").then(fileBlob => {
            const url = URL.createObjectURL(fileBlob);
            urls.push({ name: relativePath, url });
            setImages([...urls]); // update state
          });
        });
      } catch (err) {
        console.error("Error loading pictures:", err);
      }
    };

    loadPictures(); // call immediately on mount
  }, [phoneID]);

  return (
    <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
      {images.map(img => (
        <div key={img.name}>
          <img
            src={img.url}
            alt={img.name}
            style={{ width: 150, border: "1px solid #ccc" }}
          />
          <p>{img.name}</p>
        </div>
      ))}
    </div>
  );
}

export default DisplayPhonePictures;
