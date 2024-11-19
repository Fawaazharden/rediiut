from src.config.settings import KEYWORDS, TARGET_SUBREDDITS

def find_users(reddit):
    """Find users based on keywords in specified subreddits."""
    users_to_message = set()
    
    print(f"Searching in subreddits: {TARGET_SUBREDDITS}")
    print(f"Looking for keywords: {KEYWORDS}")
    
    for subreddit in TARGET_SUBREDDITS:
        try:
            print(f"Searching in {subreddit}...")
            submissions = reddit.subreddit(subreddit).search(
                ' OR '.join(KEYWORDS), 
                sort='relevance', 
                limit=10
            )
            for submission in submissions:
                if submission.author:
                    users_to_message.add(submission.author)
                    print(f"Found user: {submission.author}")
        except Exception as e:
            print(f"Error searching subreddit {subreddit}: {e}")
    
    return users_to_message