/**
 * Twitter Analytics Tools for MCP Server
 * 
 * These three tools are designed to follow the exact pattern of getTwitterDetails
 * and are ready to be dropped into your MCP server.
 * 
 * Prerequisites:
 * - Implement these methods in TwitterClient:
 *   - getUserAnalytics(username: string)
 *   - getUserTweetPerformance(username: string, maxResults: number)
 *   - getTopicTweetCount(query: string, startTime?: string, endTime?: string, granularity?: string)
 */

import { z } from "zod";
import { TwitterClient } from "./twitter";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerAnalyticsTools(server: McpServer) {
  // Tool 1: to get user analytics summary and core fields
  server.registerTool(
    "getUserAnalytics",
    {
      title: "Twitter user analytics tool",
      description:
        "Retrieves comprehensive analytics and metrics for a Twitter/X user including follower count, following count, tweet count, and other public metrics. Use this when the user asks about a Twitter account's influence, size, or basic statistics.",
      inputSchema: {
        username: z
          .string()
          .describe("Twitter/X username (without @ symbol, e.g., 'elonmusk' or 'SatheUdit')"),
      },
      outputSchema: {
        userId: z.string(),
        username: z.string(),
        name: z.string(),
        followersCount: z.number(),
        followingCount: z.number(),
        tweetCount: z.number(),
        listedCount: z.number(),
        verified: z.boolean(),
        createdAt: z.string(),
        description: z.string().optional(),
        analyticsSummary: z.string(),
      },
    },
    async ({ username }) => {
      const twitterClient = await new TwitterClient();
      //calling twitterClient.getUserAnalytics(username) : Expected to return user object with public_metrics included
      const userData = await twitterClient.getUserAnalytics(username);
      if(userData instanceof Error){
        console.log("Error in getUserAnalytics: ", userData.message);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ error: "Failed to fetch user analytics" }),
            },
          ],
        };
      }
      
      const output = {
        userId: userData.data.id,
        username: userData.data.username,
        name: userData.data.name,
        followersCount: userData.data.public_metrics?.followers_count || 0,
        followingCount: userData.data.public_metrics?.following_count || 0,
        tweetCount: userData.data.public_metrics?.tweet_count || 0,
        listedCount: userData.data.public_metrics?.listed_count || 0,
        verified: userData.data.verified || false,
        createdAt: userData.data.created_at || "",
        description: userData.data.description || "",
        analyticsSummary: `User @${userData.data.username} has ${userData.data.public_metrics?.followers_count || 0} followers, follows ${userData.data.public_metrics?.following_count || 0} accounts, and has posted ${userData.data.public_metrics?.tweet_count || 0} tweets.`,
      };
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(output),
          },
        ],
        structuredContent: output,
      };
    }
  );

  // Tool 2: To get list of tweets with their performance details
  server.registerTool(
    "getUserTweetPerformance",
    {
      title: "Twitter user tweet performance analytics tool",
      description:
        "Retrieves a user's recent tweets with detailed engagement metrics including likes, retweets, replies, and quote counts. Use this to analyze which tweets performed best, calculate average engagement rates, identify top-performing content, or understand a user's posting patterns and audience engagement.",
      inputSchema: {
        username: z
          .string()
          .describe("Twitter/X username (without @ symbol, e.g., 'elonmusk' or 'SatheUdit')"),
        maxResults: z
          .number()
          .int()
          .min(5)
          .max(100)
          .default(10)
          .describe("Maximum number of recent tweets to retrieve (between 5 and 100, default: 10)"),
      },
      outputSchema: {
        username: z.string(),
        totalTweetsRetrieved: z.number(),
        tweets: z.array(
          z.object({
            tweetId: z.string(),
            text: z.string(),
            createdAt: z.string(),
            likeCount: z.number(),
            retweetCount: z.number(),
            replyCount: z.number(),
            quoteCount: z.number(),
            totalEngagement: z.number(),
          })
        ),
        averageEngagement: z.object({
          likes: z.number(),
          retweets: z.number(),
          replies: z.number(),
          quotes: z.number(),
          total: z.number(),
        }),
        topTweet: z.object({
          tweetId: z.string(),
          text: z.string(),
          totalEngagement: z.number(),
        }),
        performanceSummary: z.string(),
      },
    },
    async ({ username, maxResults }) => {
      const twitterClient = await new TwitterClient();
      
      //calling twitterClient.getUserTweetPerformance(username, maxResults) : Expected to return tweets array with public_metrics included
      const tweetData = await twitterClient.getUserTweetPerformance(username, maxResults);
      if(tweetData instanceof Error){
        console.log("Error in getUserTweetPerformance: ", tweetData.message);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ error: "Failed to fetch tweet details" }),
            },
          ],
        };
      }

      const tweets = tweetData.data.map((tweet: any) => {
        const metrics = tweet.public_metrics || {};
        const totalEngagement = 
          (metrics.like_count || 0) + 
          (metrics.retweet_count || 0) + 
          (metrics.reply_count || 0) + 
          (metrics.quote_count || 0);
        
        return {
          tweetId: tweet.id,
          text: tweet.text,
          createdAt: tweet.created_at,
          likeCount: metrics.like_count || 0,
          retweetCount: metrics.retweet_count || 0,
          replyCount: metrics.reply_count || 0,
          quoteCount: metrics.quote_count || 0,
          totalEngagement: totalEngagement,
        };
      });
      
      // Calculate averages
      const totalTweets = tweets.length;
      const avgLikes = totalTweets > 0 
        ? tweets.reduce((sum: number, t: any) => sum + t.likeCount, 0) / totalTweets 
        : 0;
      const avgRetweets = totalTweets > 0 
        ? tweets.reduce((sum: number, t: any  ) => sum + t.retweetCount, 0) / totalTweets 
        : 0;
      const avgReplies = totalTweets > 0 
        ? tweets.reduce((sum: number, t: any) => sum + t.replyCount, 0) / totalTweets 
        : 0;
      const avgQuotes = totalTweets > 0 
        ? tweets.reduce((sum: number, t: any) => sum + t.quoteCount, 0) / totalTweets 
        : 0;
      const avgTotal = totalTweets > 0 
        ? tweets.reduce((sum: number, t: any) => sum + t.totalEngagement, 0) / totalTweets 
        : 0;
      
      // Find top performing tweet
      const topTweet = tweets.reduce((top:any, current:any) => 
        current.totalEngagement > top.totalEngagement ? current : top,
        tweets[0] || { tweetId: "", text: "", totalEngagement: 0 }
      );
      
      const output = {
        username: username,
        totalTweetsRetrieved: totalTweets,
        tweets: tweets,
        averageEngagement: {
          likes: Math.round(avgLikes * 100) / 100,
          retweets: Math.round(avgRetweets * 100) / 100,
          replies: Math.round(avgReplies * 100) / 100,
          quotes: Math.round(avgQuotes * 100) / 100,
          total: Math.round(avgTotal * 100) / 100,
        },
        topTweet: {
          tweetId: topTweet.tweetId,
          text: topTweet.text.substring(0, 200) + (topTweet.text.length > 200 ? "..." : ""),
          totalEngagement: topTweet.totalEngagement,
        },
        performanceSummary: `Analyzed ${totalTweets} recent tweets from @${username}. Average engagement: ${Math.round(avgTotal)} per tweet (${Math.round(avgLikes)} likes, ${Math.round(avgRetweets)} retweets, ${Math.round(avgReplies)} replies). Top tweet had ${topTweet.totalEngagement} total engagements.`,
      };
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(output),
          },
        ],
        structuredContent: output,
      };
    }
  );

  // ============================================================================
  // Tool 3: getTopicTweetCount
  // ============================================================================
  server.registerTool(
    "getTopicTweetCount",
    {
      title: "Twitter topic tweet count analytics tool",
      description:
        "Retrieves tweet volume counts for a specific topic, hashtag, or search query over a time period. Use this to analyze trends, monitor conversation volume, track hashtag popularity over time, or compare tweet volumes between different topics. Returns time-bucketed counts showing how tweet volume changed over the specified period.",
      inputSchema: {
        query: z
          .string()
          .describe("Search query, hashtag (with or without #), keyword, or topic to count tweets for (e.g., 'bitcoin', '#AI', 'Apple earnings')"),
        startTime: z
          .string()
          .optional()
          .describe("Start time in ISO 8601 format (e.g., '2024-01-01T00:00:00Z'). If not provided, defaults to 7 days ago."),
        endTime: z
          .string()
          .optional()
          .describe("End time in ISO 8601 format (e.g., '2024-01-08T00:00:00Z'). If not provided, defaults to now."),
        granularity: z
          .enum(["minute", "hour", "day"])
          .default("hour")
          .describe("Time granularity for the count buckets: 'minute' (last 7 days max), 'hour' (last 7 days max), or 'day' (up to 30 days)"),
      },
      outputSchema: {
        query: z.string(),
        startTime: z.string(),
        endTime: z.string(),
        granularity: z.string(),
        totalTweetCount: z.number(),
        timeBuckets: z.array(
          z.object({
            start: z.string(),
            end: z.string(),
            tweetCount: z.number(),
          })
        ),
        peakPeriod: z.object({
          start: z.string(),
          end: z.string(),
          tweetCount: z.number(),
        }),
        trendAnalysis: z.string(),
      },
    },
    async ({ query, startTime, endTime, granularity }) => {
      const twitterClient = await new TwitterClient();
      
      // This will call: twitterClient.getTopicTweetCount(query, startTime, endTime, granularity)
      // Expected to return count data with time buckets
      const countData = await twitterClient.getTopicTweetCount(query, startTime, endTime, granularity);
      if(countData instanceof Error){
        console.log("Error in getTopicTweetCount: ", countData.message);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ error: "Failed to fetch topic tweet count" }),
            },
          ],
        };
      } 

      const timeBuckets = countData.data.map((bucket: any) => ({
        start: bucket.start,
        end: bucket.end,
        tweetCount: bucket.tweet_count || 0,
      }));
      
      const totalCount = timeBuckets.reduce((sum: number, bucket: any) => sum + bucket.tweetCount, 0);
      
      // Find peak period
      const peakPeriod = timeBuckets.reduce((peak: any, current: any) => 
        current.tweetCount > peak.tweetCount ? current : peak,
        timeBuckets[0] || { start: "", end: "", tweetCount: 0 }
      );
      
      // Simple trend analysis
      const firstHalf = timeBuckets.slice(0, Math.floor(timeBuckets.length / 2));
      const secondHalf = timeBuckets.slice(Math.floor(timeBuckets.length / 2));
      const firstHalfAvg = firstHalf.length > 0 
        ? firstHalf.reduce((sum: number, b: any) => sum + b.tweetCount, 0) / firstHalf.length 
        : 0;
      const secondHalfAvg = secondHalf.length > 0 
        ? secondHalf.reduce((sum: number, b: any) => sum + b.tweetCount, 0) / secondHalf.length 
        : 0;
      const trend = secondHalfAvg > firstHalfAvg * 1.1 
        ? "increasing" 
        : secondHalfAvg < firstHalfAvg * 0.9 
        ? "decreasing" 
        : "stable";
      
      const output = {
        query: query,
        startTime: countData.meta?.start_time || startTime || "",
        endTime: countData.meta?.end_time || endTime || "",
        granularity: granularity,
        totalTweetCount: totalCount,
        timeBuckets: timeBuckets,
        peakPeriod: peakPeriod,
        trendAnalysis: `Found ${totalCount} total tweets for "${query}" over the specified period. Trend is ${trend} (first half avg: ${Math.round(firstHalfAvg)}, second half avg: ${Math.round(secondHalfAvg)}). Peak period had ${peakPeriod.tweetCount} tweets between ${peakPeriod.start} and ${peakPeriod.end}.`,
      };
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(output),
          },
        ],
        structuredContent: output,
      };
    }
  );
}

