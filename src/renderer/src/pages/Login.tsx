import { Form } from "@renderer/components/Form";
import { Input } from "@renderer/components/Input";
import { PERSISTED_STORAGE } from "@renderer/libs/persisted-storage";
import { initOctokit } from "@renderer/utils/client";
import { useNavigate } from "@solidjs/router";
import ncrypt from "ncrypt-js";
import { createSignal, JSX } from "solid-js";

export default function Login() {
  const [error, setError] = createSignal("");
  const navigate = useNavigate();

  const login: JSX.EventHandler<HTMLFormElement, SubmitEvent> = (e) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const password = data.get("password") as string;

    if (!password) {
      setError("Field is required");
      return;
    }

    const { decrypt } = new ncrypt(password);
    const encryptedPat = PERSISTED_STORAGE.get("noti-user-key") as string;
    try {
      const pat = decrypt(encryptedPat) as string;
      initOctokit(pat);
      navigate("/dashboard/notifications", { replace: true });
    } catch (e) {
      const error = e as { message: string };
      console.error("Error decrypting key", { message: error.message });
      setError("Invalid password");
    }
  };

  return (
    <Form title="Login" onSubmit={login}>
      <Input id="password" name="password" type="password" label="Password" error={error} />
    </Form>
  );
}
