import { GraphQLClient, gql } from "graphql-request";

function getClient() {
  const endpoint = process.env.WORDPRESS_API_URL;
  if (!endpoint) {
    throw new Error(
      "WORDPRESS_API_URL is not set. Copy .env.local.example to .env.local and point it at your WPGraphQL endpoint."
    );
  }
  return new GraphQLClient(endpoint);
}

// graphql-request's own GraphQLClientResponse type isn't exported from the
// package, and (despite what it claims) `data` isn't actually guaranteed to
// be present at runtime — a WordPress-side failure can respond with a
// "valid-looking" but data-less body (e.g. {"errors": [...]}), which
// client.request() would silently reduce to `undefined` with no clue why.
// rawRequest() keeps the full response around instead, so a failure here
// can say what WordPress actually said.
type WPGraphQLResponse<T> = {
  data?: T;
  errors?: { message: string }[];
  status: number;
};

function getResponseData<T>(
  response: WPGraphQLResponse<T>,
  queryName: string
): T {
  if (response.data) {
    return response.data;
  }
  const errorMessages = response.errors?.map((e) => e.message).join("; ");
  throw new Error(
    `WPGraphQL returned no data for ${queryName} (HTTP ${response.status})` +
      (errorMessages
        ? `: ${errorMessages}`
        : " — the WordPress backend (WORDPRESS_API_URL) may be down or erroring.")
  );
}

export type Page = {
  title: string;
  content: string | null;
};

const GET_PAGE = gql`
  query GetPage($uri: ID!) {
    page(id: $uri, idType: URI) {
      title
      content
    }
  }
`;

export async function getPage(uri: string): Promise<Page | null> {
  const client = getClient();
  const response = await client.rawRequest<{ page: Page | null }>(GET_PAGE, {
    uri,
  });
  const data = getResponseData(response, "GetPage");
  return data.page;
}
