declare module "*.svg" {
  const svg: React.FC<HTMLProps<SVGElement>>;
  export default svg;
}
declare module "*.png";
declare module "*.svg";
declare module "*.jpeg";
declare module "*.jpg";
declare module "*.css";

interface ImportMetaEnv {
  VITE_API_URL: string;
}

/// <reference types="vite/client" />
