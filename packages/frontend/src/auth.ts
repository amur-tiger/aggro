import { readable, writable } from "svelte/store";

const isLoggedInWritable = writable(false);

export const isLoggedIn = readable(false, (set) =>
  isLoggedInWritable.subscribe(set)
);

export async function checkLogin(): Promise<boolean> {
  const response = await fetch("/api/me");
  const result = await response.json();
  isLoggedInWritable.update(() => result.data.isLoggedIn);
  return result.data.isLoggedIn;
}

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
  isLoggedInWritable.update(() => true);
}

export async function logout(): Promise<void> {
  const response = await fetch("/api/logout", {
    method: "POST",
  });
  const result = await response.json();
  if ("errors" in result) {
    throw new Error(result.errors[0].message);
  }
  isLoggedInWritable.update(() => false);
}
