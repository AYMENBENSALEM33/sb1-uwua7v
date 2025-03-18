export const buildFullUrl = (baseURL: string, path: string, params?: Record<string, any>): string => {
  // Ensure baseURL ends with a slash if it doesn't already
  const normalizedBaseURL = baseURL.endsWith('/') ? baseURL : `${baseURL}/`;
  // Remove leading slash from path if it exists
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  
  const url = new URL(normalizedPath, normalizedBaseURL);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });
  }
  
  return url.toString();
};