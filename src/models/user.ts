import { Query } from "@shared/cqrs";

export interface GetUserQuery extends Query<GetUserQueryResult> {
  id: string;
}
export interface GetUserQueryResult {
  displayName: string;
}
