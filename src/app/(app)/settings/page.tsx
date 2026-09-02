import type { Metadata } from "next";
import { dataSources, isConfigured } from "@/config/integrations";
import { SettingsView } from "./settings-view";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  // isConfigured reads process.env, which only exists on the server, so the
  // status is resolved here and handed to the client component as data.
  const sources = dataSources.map((source) => ({
    key: source.key,
    name: source.name,
    envVars: source.envVars,
    docsUrl: source.docsUrl,
    replaces: source.replaces,
    connected: isConfigured(source),
  }));

  return <SettingsView sources={sources} />;
}
