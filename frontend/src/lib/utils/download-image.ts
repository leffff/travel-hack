export const downloadImage = (imageUrl: string, filename?: string | null) => {
  return fetch(imageUrl, {
    mode: "no-cors",
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  })
    .then((response) => response.blob())
    .then((blob) => {
      // Create a blob URL
      const url = window.URL.createObjectURL(blob);
      // Create a temporary anchor element
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || decodeURIComponent(imageUrl.split("/").pop()!) || "image";
      document.body.appendChild(a);
      a.click();
      // Remove the anchor element and release the blob URL
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    })
    .catch((e) => console.error(e));
};

export const getFileFromUrl = async (url: string): Promise<File> => {
  const res = await (await fetch(`https://cors-anywhere.herokuapp.com/${url}`)).blob();
  const file = new File([res], `downloadedImage.${url.split(".").pop() || "jpg"}`, {
    type: res.type
  });

  return file;
};
