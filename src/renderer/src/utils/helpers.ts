import { openExternalLink } from "@renderer/utils/comms";
import { Notification } from "@renderer/githubTypes";
import { getHtmlUrl } from "@renderer/utils/client";

export async function openInBrowser(notification: Notification) {
  const url = await generateGitHubWebUrl(notification);

  openExternalLink(url);
}

export async function generateGitHubWebUrl(n: Notification): Promise<string> {
  const url = new URL(n.repository.html_url);

  if (
    n.subject.type === "PullRequest" &&
    n.subject.latest_comment_url === n.subject.url &&
    n.pull
  ) {
    url.href = n.pull.html_url;
  } else if (n.subject.latest_comment_url) {
    url.href = await getHtmlUrl(n.subject.latest_comment_url);
  } else if (n.subject.url) {
    url.href = await getHtmlUrl(n.subject.url);
  }

  return url.toString();
}

const LABELS_BY_REASON: Record<string, string> = {
  mention: "Mentioned",
  assign: "Assigned",
  author: "Replied",
  review_requested: "Review requested",
  comment: "Commented",
  security_alert: "Security alert",
};

export function getReason(n: Notification) {
  if (n.pull?.state !== "closed") {
    return LABELS_BY_REASON[n.reason];
  }

  if (n.pull?.merged) {
    return "Merged";
  }

  return "Closed";
}
