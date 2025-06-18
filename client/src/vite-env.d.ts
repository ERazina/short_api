/// <reference types="vite/client" />
// src/declarations.d.ts
declare module "*.css";
declare module "*.scss";
declare module "*.sass";
declare module "*.module.css";
declare module "*.module.scss";

declare module "*.svg" {
  const content: string;
  export default content;
}
