export const downloadImage = (imageUrl: string, filename?: string | null) => {
  fetch(imageUrl)
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
