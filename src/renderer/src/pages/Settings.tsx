import { Form } from "@renderer/components/Form";
import IconLink from "@renderer/components/IconLink";
import { BackIcon } from "@renderer/components/icons/BackIcon";
import { Input } from "@renderer/components/Input";
import { useGlobalStore } from "@renderer/context/GlobalStoreProvider";
import { PERSISTED_STORAGE } from "@renderer/libs/persisted-storage";
import { initOctokit } from "@renderer/utils/client";
import ncrypt from "ncrypt-js";
import { createSignal, JSX } from "solid-js";

export default function Settings() {
  const [error, setError] = createSignal("");
  const [{ isFetchingAuth }, { refetchAuthUser }] = useGlobalStore();

  const updateCreds: JSX.EventHandler<HTMLFormElement, SubmitEvent> = (e) => {
    e.preventDefault();

    if (isFetchingAuth()) {
      return;
    }

    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const pat = data.get("pat") as string;
    const password = data.get("password") as string;

    if (!pat || !password) {
      setError("Field is required");
      return;
    }

    const { encrypt } = new ncrypt(password);
    PERSISTED_STORAGE.set("noti-user-key", encrypt(pat));

    initOctokit(pat);
    refetchAuthUser();
  };

  return (
    <div class="p-3 flex flex-col gap-4">
      <div>
        <IconLink href="/dashboard/notifications">
          <BackIcon />
        </IconLink>
      </div>
      <Form
        title="Update GitHub Authentication"
        onSubmit={updateCreds}
        class="h-full"
        isSubmitting={isFetchingAuth}
      >
        <Input id="pat" name="pat" type="password" label="Personal Access Token" error={error} />
        <Input id="password" name="password" type="password" label="Password" error={error} />
      </Form>
    </div>
  );
}
