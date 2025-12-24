import { TwitterApi } from "twitter-api-v2";
import { injectable } from "inversify";
import { TYPES } from "../../types";
export class TwitterClient {
  id: string;
  client: any;
  constructor() {
    this.id = "randomStringId"; //TODO: remove this and add a uclid ID  here
    const appOnlyClient = new TwitterApi(
      process.env.TWITTER_API_BEARER_TOKEN as string
    ); // have passed the Bearer token in this
    this.client = appOnlyClient;
  }

  getUserDetails: any = async (userName?: string) => {
    const user = await this.client.v2.userByUsername(userName ?? "SatheUdit");
    console.log("Here are the user details from the API ");
    console.log(JSON.stringify(user));
    return user;
  };

  getUserAnalytics = async (username: string) => {
    const user = await this.client.v2.userByUsername(username, {
      "user.fields": "public_metrics,created_at,description,verified",
    });
    console.log(`User analytics for @${username}:`, JSON.stringify(user));
    return user;
  };

  getUserTweetPerformance = async (username: string, maxResults: number) => {
    // getting the user id
    const userResponse = await this.client.v2.userByUsername(username);
    const userId = userResponse.data.id;
    
    // getting the user timeline with metrics
    const tweets = await this.client.v2.userTimeline(userId, {
      max_results: maxResults,
      "tweet.fields": "public_metrics,created_at",
    });
    console.log(`Retrieved ${tweets.data?.data?.length || 0} tweets for @${username}`);
    return tweets;
  };

  getTopicTweetCount = async (
    query: string,
    startTime?: string,
    endTime?: string,
    granularity: string = "hour"
  ) => {
    const options: any = {
      granularity: granularity,
    };
    
    if (startTime) options.start_time = startTime;
    if (endTime) options.end_time = endTime;
    
    const counts = await this.client.v2.tweetCountRecent(query, options);
    console.log(`Tweet count for "${query}":`, JSON.stringify(counts));
    return counts;
  };
}

