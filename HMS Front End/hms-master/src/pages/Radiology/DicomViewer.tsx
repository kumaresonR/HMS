import React, { useEffect, useRef } from "react";
import cornerstone from "cornerstone-core";
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import dicomParser from "dicom-parser";

cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

const DicomViewer = (props:any) => {
  const viewportRef = useRef<any>(null);

  const base64DicomData = props.img
  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;

    // Convert base64 to a Blob
    const binaryStr = atob(base64DicomData);
    const len = binaryStr.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    const dicomBlob = new Blob([bytes], { type: "application/dicom" });

    // Create object URL from blob
    const objectUrl = URL.createObjectURL(dicomBlob);
    const imageId = `wadouri:${objectUrl}`;

    // Enable and load the image
    cornerstone.enable(element);
    cornerstone
      .loadImage(imageId)
      .then((image:any) => {
        cornerstone.displayImage(element, image);
      })
      .catch((err:any) => {
        console.error("Failed to load DICOM image", err);
      });

    return () => {
      cornerstone.disable(element);
      URL.revokeObjectURL(objectUrl); 
    };
  }, []);

  return (
    <div>
      <div
        ref={viewportRef}
        style={{ width: "512px", height: "512px", backgroundColor: "black" }}
      ></div>
    </div>
  );
};

export default DicomViewer;
