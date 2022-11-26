import { createResource, For } from "solid-js";
import gql from "graphql-tag";
import { createQuery } from "../../graphql";
import { Card } from "../../components";
import { SourcesQuery, SourcesQueryVariables } from "../../generated/graphql";
import "./SourceList.sass";

const fetchSources = createQuery<SourcesQuery, SourcesQueryVariables>(
  gql`
    query Sources {
      sources {
        totalCount
        pageInfo {
          startCursor
          endCursor
          hasPreviousPage
          hasNextPage
        }
        edges {
          cursor
          node {
            id
            type
            title
            added
            lastUpdate
            url
            faviconUrl
          }
        }
      }
    }
  `
);

export interface SourceListProps {}

export default function SourceList() {
  const [sources] = createResource(fetchSources);

  return (
    <div class="source-list">
      total: {sources()?.sources.totalCount}
      <For each={sources()?.sources.edges}>
        {({ node }) => (
          <Card>
            <div class="image">
              <img src={node.faviconUrl} alt="icon" />
            </div>

            <div class="info">
              <h2 class="typography-headline-small">{node.title}</h2>

              <span>(via {node.type})</span>
              <span>at {node.url}</span>
              <span>added {node.added}</span>
            </div>
          </Card>
        )}
      </For>
    </div>
  );
}
