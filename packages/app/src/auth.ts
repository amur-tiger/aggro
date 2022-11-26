import { createResource } from "solid-js";

export interface UserData {
  isLoggedIn: boolean;
  message: string;
  session?: {
    created: string;
  };
  user?: {
    id: string;
    lastlogin?: string;
    mail: string;
    registered: string;
    username: string;
  };
}

const [userDataValue, { mutate }] = createResource(async () => {
  const response = await fetch("/api/me");
  const result = await response.json();
  return result.data as UserData;
});

export const userData = userDataValue;

export async function login(mail: string, password: string): Promise<void> {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mail,
      password,
    }),
  });
  const result = await response.json();
  if ("errors" in result) {
    throw new Error(result.errors[0].message);
  }
  mutate(result.data);
}

export async function logout(): Promise<void> {
  const response = await fetch("/api/logout", {
    method: "POST",
  });
  const result = await response.json();
  if ("errors" in result) {
    throw new Error(result.errors[0].message);
  }
  mutate(result.data);
}
