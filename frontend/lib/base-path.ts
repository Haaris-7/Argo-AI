const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const appBasePath = configuredBasePath
  ? `/${configuredBasePath.replace(/^\/+|\/+$/g, "")}`
  : "";

export function withBasePath(path: string) {
  const pathname = path.startsWith("/") ? path : `/${path}`;
  return `${appBasePath}${pathname}`;
}
