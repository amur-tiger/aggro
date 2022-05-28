<script>
  import SourceList from "./SourceList.svelte";
  import Button from "../../components/Button.svelte";
</script>

<Button variant="text" on:click={() => history.pushState("", "", "/")}>
  Home
</Button>
<SourceList />
