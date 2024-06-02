import { Form } from "@renderer/components/Form";
import { Input } from "@renderer/components/Input";
import { PERSISTED_STORAGE } from "@renderer/libs/persisted-storage";
import { initOctokit } from "@renderer/utils/client";
import { useNavigate } from "@solidjs/router";
import ncrypt from "ncrypt-js";
import { createSignal, JSX } from "solid-js";

export default function Registration() {
  const navigate = useNavigate();
  const [error, setError] = createSignal("");

  const register: JSX.EventHandler<HTMLFormElement, SubmitEvent> = (e) => {
    e.preventDefault();

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
    navigate("/dashboard/notifications", { replace: true });
  };

  return (
    <Form title="GitHub Authentication" onSubmit={register}>
      <Input id="pat" name="pat" type="password" label="Personal Access Token" error={error} />
      <Input id="password" name="password" type="password" label="Password" error={error} />
    </Form>
  );
}
