export const config = {
  ftp: {
    host: process.env.BOM_FTP_HOST || 'ftp.bom.gov.au',
    // Default to FTP (insecure) as BOM requires credentials for FTPS
    // Set BOM_FTP_SECURE=true when credentials are available
    secure: process.env.BOM_FTP_SECURE === 'true',
    warningsPath: process.env.BOM_WARNINGS_PATH || '/anon/gen/fwo/',
  },
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
  },
  // Ready for future caching implementation
  cache: {
    ttlSeconds: parseInt(process.env.CACHE_TTL || '300', 10), // 5 min default
  },
};
