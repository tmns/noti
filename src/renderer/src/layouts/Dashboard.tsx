import Header from "@renderer/components/Header";
import IconLink from "@renderer/components/IconLink";
import { SettingsIcon } from "@renderer/components/icons/SettingsIcon";
import { ParentProps } from "solid-js";

export default function Dashboard(props: ParentProps) {
  return (
    <div class="py-2 px-1 flex flex-col h-[600px]">
      <Header />
      <div class="flex-1 overflow-y-auto flex flex-col">{props.children}</div>
      <div class="flex py-1 px-2">
        <IconLink href="/dashboard/settings">
          <SettingsIcon />
        </IconLink>
      </div>
    </div>
  );
}
