import { TwitterApi } from "twitter-api-v2";

export class TwitterClient {
  id: string;
  client: any;
  constructor() {
    this.id = "randomStringId";
    const appOnlyClient = new TwitterApi(process.env.TWITTER_API_BEARER_TOKEN); // have passed the BEarer token in this
    this.client = appOnlyClient;
  }

  getUserDetails: any = async (userName?: string) => {
    const user = await this.client.v2.userByUsername(userName ?? "SatheUdit");
    console.log("Here are the user details from the API ");
    console.log(JSON.stringify(user));
    return user;
  };

  //TODO: start writing other methods that we intend to use from the client and write neccessary types
  //   getPostAnalytics: any = async (postId?: string) => {
  //     const postAnalytics = await this.client.v2.postANALYTICS();
  //     console.log("Here are the user details from the API ");
  //     console.log(JSON.stringify(user));
  //     return user;
  //   };
}

// Tell typescript it's a readonly app
// const readOnlyClient = twitterClient.readOnly;

// // Play with the built in methods
// const user = await readOnlyClient.v2.userByUsername('SatheUdit');
// await twitterClient.v2.tweet('Hello, this is a test.');
// // You can upload media easily!
// await twitterClient.v1.uploadMedia('./big-buck-bunny.mp4');
