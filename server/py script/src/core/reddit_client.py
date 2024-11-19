import praw
from src.config.settings import *

class RedditClient:
    def authenticate():
        """Authenticate with the Reddit API."""
        try:
            print("Attempting to authenticate...")
            reddit = praw.Reddit(
                client_id=REDDIT_CLIENT_ID,
                client_secret=REDDIT_CLIENT_SECRET,
                user_agent=REDDIT_USER_AGENT,
                username=REDDIT_USERNAME,
                password=REDDIT_PASSWORD
            )
            print("Authentication successful!")
            return reddit
        except Exception as e:
            print(f"Authentication failed: {e}")
            raise

    def create_message(username):
        """Create a personalized message for the user."""
        return f"Hi {username}, I noticed your interest in {KEYWORDS[0]}. I'd love to share more about my project that aligns with it!"

    def send_messages(reddit, users):
        """Send direct messages to the list of users."""
        for user in users:
            try:
                message = create_message(user.name)
                user.message('Subject of Your Message', message)
                print(f"Sent message to {user.name}")
                time.sleep(MESSAGE_DELAY)
            except Exception as e:
                print(f"Failed to send message to {user.name}: {e}")