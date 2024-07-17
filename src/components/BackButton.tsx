/** @jsxImportSource frog/jsx */

import { Button } from "frog";

export function BackButton({ id }: { id: number }) {
  return <Button action={`/${id}`}>⇠ Back</Button>;
}
