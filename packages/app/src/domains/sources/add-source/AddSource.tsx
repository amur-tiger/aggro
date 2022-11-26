import { createSignal, For, Show } from "solid-js";
import gql from "graphql-tag";
import { t } from "../../../lang";
import { createQuery } from "../../../graphql";
import { Card, Drawer, FormControl, Spinner } from "../../../components";
import {
  AddSourceMutation,
  AddSourceMutationVariables,
  DiscoverQuery,
  DiscoverQueryVariables,
} from "../../../generated/graphql";
import "./AddSource.sass";

const discoverSources = createQuery<DiscoverQuery, DiscoverQueryVariables>(gql`
  query Discover($url: String!) {
    discover(url: $url) {
      items {
        title
        type
        url
        faviconUrl
      }
    }
  }
`);

const addSource = createQuery<AddSourceMutation, AddSourceMutationVariables>(gql`
  mutation AddSource($input: AddSourceInput!) {
    addSource(input: $input) {
      id
      type
      title
      added
      lastUpdate
      url
      faviconUrl
    }
  }
`);

export interface AddSourceProps {
  open?: boolean;
  onClose?: () => void;
  onAddSource?: (source: AddSourceMutation["addSource"]) => void;
}

export default function AddSource(props: AddSourceProps) {
  const [url, setUrl] = createSignal("");
  const [isLoading, setLoading] = createSignal(false);
  const [sources, setSources] = createSignal<DiscoverQuery>();

  const handleSearch = () => {
    setLoading(true);
    setSources(undefined);
    discoverSources({ url: url() })
      .then(setSources)
      .finally(() => setLoading(false));
  };

  const handleAddSource = (data: DiscoverQuery["discover"]["items"][0]) => {
    addSource({
      input: {
        url: data.url,
        type: data.type,
        title: data.title,
      },
    }).then((result) => {
      props?.onAddSource?.(result.addSource);
    });
  };

  return (
    <Drawer open={props.open} onClose={props.onClose} class="add-source-drawer">
      <h2 class="typography-headline-small">{t("source.add.title")}</h2>

      <div class="add-source-inputs">
        <FormControl
          label={t("source.add.form-label")}
          value={url()}
          onInput={(e) => setUrl(e.currentTarget.value)}
          disabled={isLoading()}
          required
        />

        <button disabled={isLoading()} onClick={handleSearch}>
          {t("source.add.search")}
        </button>
      </div>

      <Show when={isLoading()}>
        <Spinner />
      </Show>

      <div class="add-source-discoveries">
        <For each={sources()?.discover.items}>
          {(item) => (
            <Card>
              {item.title} at {item.url} via {item.type}
              <button onClick={[handleAddSource, item]}>+</button>
            </Card>
          )}
        </For>
      </div>
    </Drawer>
  );
}
