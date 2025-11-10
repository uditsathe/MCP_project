declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_URL: string;
    TWITTER_API_KEY: string;
    TWITTER_API_BEARER_TOKEN: string;
    // Add more as needed
  }
}
