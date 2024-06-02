import { Endpoints } from "@octokit/types";

type ObjectTypeFromArray<T extends any[]> = T extends (infer U)[] ? U : never;

export type Notifications = Endpoints["GET /notifications"]["response"]["data"];
export interface Notification extends ObjectTypeFromArray<Notifications> {
  pull?: Pull;
}

export type PullResponse = Endpoints["GET /repos/{owner}/{repo}/pulls/{pull_number}"]["response"];

export type Pull = PullResponse["data"];

export type Pulls = Endpoints["GET /repos/{owner}/{repo}/pulls"]["response"]["data"];

export type AuthUser = Endpoints["GET /user"]["response"]["data"];
