import IconLink from "@renderer/components/IconLink";
import { NotificationBoxIcon } from "@renderer/components/icons/NotificationBoxIcon";
import { PullRequestIcon } from "@renderer/components/icons/PullRequestIcon";
import { useGlobalStore } from "@renderer/context/GlobalStoreProvider";
import { useLocation } from "@solidjs/router";

export default function Header() {
  const [{ searchQuery }, { setSearchQuery }] = useGlobalStore();
  const location = useLocation();

  return (
    <div class="p-2 flex">
      <div class="flex-1">
        <label for="search" class="sr-only">
          Search
        </label>
        <input
          id="search"
          class="w-full bg-transparent border-none text-primary-foreground outline-hidden"
          placeholder="Search..."
          value={searchQuery()}
          onInput={(e) => setSearchQuery(e.currentTarget.value)}
        />
      </div>
      {location.pathname === "/dashboard/notifications" ? (
        <IconLink href="/dashboard/pulls">
          <PullRequestIcon />
        </IconLink>
      ) : (
        <IconLink href="/dashboard/notifications">
          <NotificationBoxIcon />
        </IconLink>
      )}
    </div>
  );
}
