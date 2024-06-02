import { Octokit } from "octokit";
import { AuthUser, Notification, PullResponse, Pulls } from "@renderer/githubTypes";

export let octokit: Octokit;

export function initOctokit(pat: string) {
  octokit = new Octokit({
    auth: pat,
    throttle: { enabled: false },
  });
  return octokit;
}

/**
 * Get the `html_url` from the GitHub response
 */
export async function getHtmlUrl(url: string): Promise<string> {
  const response = await octokit.request(`GET ${url}`);
  return response.data.html_url;
}

interface FetchNotisError extends Error {
  code?: string;
  status?: number;
}

export async function fetchNotis(authUser: AuthUserOrError): Promise<Notification[]> {
  if (!authUser || "error" in authUser) {
    return [];
  }

  try {
    const res = await octokit.rest.activity.listNotificationsForAuthenticatedUser({
      participating: true,
      headers: { "If-None-Match": "" },
    });

    const notis = res.data as Notification[];

    const notisByPullNumber = new Map<number, Notification>();
    const pullReqs: Promise<PullResponse | null>[] = [];

    notis.forEach((n) => {
      if (n.subject.type === "PullRequest") {
        try {
          const pullNumber = Number(n.subject.url.split("/pulls/")[1]);
          if (isNaN(pullNumber)) {
            console.warn("Invalid pull request URL format:", n.subject.url);
            return;
          }
          notisByPullNumber.set(pullNumber, n);

          pullReqs.push(
            octokit.rest.pulls
              .get({
                repo: n.repository.name,
                owner: n.repository.owner.login,
                pull_number: pullNumber,
              })
              .catch((error) => {
                console.warn(`Failed to fetch pull request ${pullNumber}:`, error);
                return null;
              }),
          );
        } catch (error) {
          console.warn("Error processing notification:", error);
        }
      }
    });

    const pulls = await Promise.all(pullReqs);

    pulls.forEach((p) => {
      if (!p) return; // Skip failed requests

      const noti = notisByPullNumber.get(p.data.number);
      if (noti) {
        noti.pull = p.data;
      }
    });

    return notis;
  } catch (e) {
    const error = e as FetchNotisError;
    console.error("Error fetching notifications:", {
      message: error.message,
      code: error.code,
      status: error.status,
    });

    if (error.status === 403) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }

    throw new Error("Failed to fetch notifications. Please try again.");
  }
}

interface FetchAuthError extends Error {
  code?: string;
  status?: number;
}

type AuthUserOrError = AuthUser | { error: string };

export async function fetchAuthUser(): Promise<AuthUserOrError> {
  try {
    const res = await octokit.rest.users.getAuthenticated();
    return res.data;
  } catch (e) {
    const error = e as FetchAuthError;
    console.error("Error fetching auth user:", {
      message: error.message,
      code: error.code,
      status: error.status,
    });

    return { error: "Error fetching auth user." };
  }
}

interface FetchPullsError extends Error {
  code?: string;
  status?: number;
}

const CACHE_TTL = 1 * 60 * 1000;
const pullsCache = new Map<string, { data: Pulls[]; timestamp: number }>();

export async function fetchPulls(authUser: AuthUserOrError): Promise<Pulls[]> {
  if (!authUser || "error" in authUser) {
    return [];
  }

  const cacheKey = authUser.login;
  const cachedData = pullsCache.get(cacheKey);
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
    // Return cached data with a 1s "delay" so the loading animation is given
    // a chance to run, in turn communicating responsiveness to the user.
    return new Promise((res) => setTimeout(() => res(cachedData.data), 1000));
  }

  try {
    const [reposForUserRes, orgsRes] = await Promise.all([
      octokit.rest.repos.listForAuthenticatedUser({
        per_page: 100,
        sort: "updated",
        headers: { "If-None-Match": "" },
      }),
      octokit.rest.orgs.listForAuthenticatedUser({
        per_page: 100,
        headers: { "If-None-Match": "" },
      }),
    ]);

    const reposForOrgsPromises = orgsRes.data.map((o) =>
      octokit.rest.repos.listForOrg({
        org: o.login,
        per_page: 100,
        sort: "updated",
        headers: { "If-None-Match": "" },
      }),
    );

    const reposForOrgsRes = await Promise.all(reposForOrgsPromises);

    const allRepos = [...reposForUserRes.data, ...reposForOrgsRes.flatMap((res) => res.data)];

    // Filter repos first to reduce API calls
    const activeRepos = allRepos.filter(
      (repo) =>
        !repo.archived &&
        !repo.disabled &&
        (repo.permissions?.pull || repo.permissions?.push || repo.permissions?.admin),
    );

    const pullsPromises = activeRepos.map((r) =>
      octokit.rest.pulls.list({
        repo: r.name,
        owner: r.owner.login,
        state: "open",
        per_page: 100,
        headers: { "If-None-Match": "" },
      }),
    );

    const pullsResponses = await Promise.all(pullsPromises);
    const pullsToReturn: Pulls[] = [];

    pullsResponses.forEach((response) => {
      const filteredPulls = response.data.filter(
        (pull) => pull.user?.login === authUser.login && !pull.draft,
      );

      if (filteredPulls.length) {
        pullsToReturn.push(filteredPulls);
      }
    });

    // Update cache
    pullsCache.set(cacheKey, {
      data: pullsToReturn,
      timestamp: Date.now(),
    });

    return pullsToReturn;
  } catch (e) {
    const error = e as FetchPullsError;
    console.error("Error fetching pulls:", {
      message: error.message,
      code: error.code,
      status: error.status,
    });

    if (error.status === 403) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }

    throw new Error("Failed to fetch pull requests. Please try again.");
  }
}
