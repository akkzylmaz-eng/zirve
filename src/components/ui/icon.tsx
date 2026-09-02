import { DynamicIcon } from "lucide-react/dynamic";
import type { ComponentProps } from "react";

type DynamicIconProps = ComponentProps<typeof DynamicIcon>;

/**
 * Renders a lucide icon from its kebab-case name, so config modules can refer
 * to icons as plain strings without importing components.
 */
export function Icon({
  name,
  ...props
}: { name: string } & Omit<DynamicIconProps, "name">) {
  return <DynamicIcon name={name as DynamicIconProps["name"]} {...props} />;
}
