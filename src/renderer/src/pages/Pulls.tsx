import { RefreshIcon } from "@renderer/components/icons/RefreshIcon";
import Message from "@renderer/components/Message";
import PullsSection from "@renderer/components/PullsSection";
import { useGlobalStore } from "@renderer/context/GlobalStoreProvider";
import { cn } from "@renderer/libs/cn";
import { For } from "solid-js";

export default function Pulls() {
  const [{ displayedPulls, isFetchingPulls }, { refetchPulls }] = useGlobalStore();

  // Refetch pulls every time components mounts.
  refetchPulls();

  return (
    <>
      <button
        onClick={refetchPulls}
        disabled={isFetchingPulls()}
        class={cn(
          "text-muted-foreground hover:text-primary-foreground transition-colors self-end p-2",
          isFetchingPulls() && "animate-spin",
        )}
      >
        <RefreshIcon />
      </button>
      <For each={displayedPulls()} fallback={<Message>No open pull requests found</Message>}>
        {(repoPulls) => (
          <>
            <PullsSection.Header>
              {repoPulls[0].base.repo.name} ({repoPulls.length})
            </PullsSection.Header>
            <PullsSection.List pulls={repoPulls} />
          </>
        )}
      </For>
    </>
  );
}
