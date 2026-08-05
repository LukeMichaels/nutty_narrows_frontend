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

// Artists and Locations are both plain WordPress Pages (slugs "artists" /
// "locations") carrying an ACF repeater field group built directly in
// wp-admin (Custom Fields > Field Groups) — not a custom post type or ACF
// Block. Each repeater row is one artist / one machine location. This
// mirrors how every other page's content is edited, so there's a single,
// consistent authoring experience instead of a separate admin screen per
// content type.
//
// Both field groups nest a repeater field inside a group field with the
// same GraphQL name (set that way in the ACF UI), which is why the query
// shape below has a doubled-up "artists { artists { ... } }" /
// "locations { locations { ... } }" — that's not a typo.
export type AcfImage = {
  node: {
    sourceUrl: string;
    altText: string;
  };
} | null;

export type AcfLink = {
  url: string;
  title: string | null;
  target: string | null;
} | null;

export type ArtistEntry = {
  name: string | null;
  bio: string | null;
  link: AcfLink;
  image: AcfImage;
};

export type ArtistsPage = {
  title: string;
  content: string | null;
  artists: {
    artists: ArtistEntry[] | null;
  } | null;
};

const GET_ARTISTS_PAGE = gql`
  query GetArtistsPage {
    page(id: "artists", idType: URI) {
      title
      content
      artists {
        artists {
          name
          bio
          link {
            url
            title
            target
          }
          image {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
    }
  }
`;

export async function getArtistsPage(): Promise<ArtistsPage | null> {
  const client = getClient();
  const response = await client.rawRequest<{ page: ArtistsPage | null }>(
    GET_ARTISTS_PAGE
  );
  const data = getResponseData(response, "GetArtistsPage");
  return data.page;
}

export type LocationEntry = {
  title: string | null;
  address: string | null;
  notes: string | null;
  image: AcfImage;
};

export type LocationsPage = {
  title: string;
  content: string | null;
  locations: {
    locations: LocationEntry[] | null;
  } | null;
};

const GET_LOCATIONS_PAGE = gql`
  query GetLocationsPage {
    page(id: "locations", idType: URI) {
      title
      content
      locations {
        locations {
          title
          address
          notes
          image {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
    }
  }
`;

export async function getLocationsPage(): Promise<LocationsPage | null> {
  const client = getClient();
  const response = await client.rawRequest<{ page: LocationsPage | null }>(
    GET_LOCATIONS_PAGE
  );
  const data = getResponseData(response, "GetLocationsPage");
  return data.page;
}
