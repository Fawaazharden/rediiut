import sys
import json
import praw
from core.reddit_client import RedditClient
from core.user_finder import find_users

def main():
    # Get arguments from command line
    keywords = json.loads(sys.argv[1])
    subreddits = json.loads(sys.argv[2])
    client_id = sys.argv[3]
    client_secret = sys.argv[4]
    user_agent = sys.argv[5]
    username = sys.argv[6]
    password = sys.argv[7]

    reddit = praw.Reddit(
        client_id=client_id,
        client_secret=client_secret,
        user_agent=user_agent,
        username=username,
        password=password
    )

    try:
        users = find_users(reddit)
        RedditClient.send_messages(reddit, users)
        print(json.dumps({"success": True, "users": len(users)}))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()