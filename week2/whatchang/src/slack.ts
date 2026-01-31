const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

export async function sendSlackAlert(
  channel: string,
  text: string,
): Promise<void> {
  if (!SLACK_WEBHOOK_URL) {
    console.error("SLACK_WEBHOOK_URL environment variable is not set");
    return;
  }

  const response = await fetch(SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ channel, text }),
  });

  if (!response.ok) {
    console.error(
      `Slack alert failed: ${response.status} ${response.statusText}`,
    );
  }
}
