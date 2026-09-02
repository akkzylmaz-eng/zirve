import { describe, expect, it } from "vitest";
import { keywordsToCsv } from "@/features/keywords/lib/export-csv";
import { makeKeyword } from "./helpers";

/** Strip the Excel BOM and split into lines for assertions. */
function lines(csv: string): string[] {
  return csv.replace(/^﻿/, "").trimEnd().split("\n");
}

describe("keywordsToCsv", () => {
  it("emits a header plus one row per keyword", () => {
    const rows = lines(keywordsToCsv([makeKeyword({ id: "a" }), makeKeyword({ id: "b" })]));
    expect(rows).toHaveLength(3);
    expect(rows[0]).toContain("keyword");
  });

  it("starts with a BOM so Excel reads Turkish characters correctly", () => {
    expect(keywordsToCsv([])).toMatch(/^﻿/);
  });

  it("quotes phrases containing a comma", () => {
    const csv = keywordsToCsv([makeKeyword({ phrase: "crm, free" })]);
    expect(lines(csv)[1].startsWith('"crm, free"')).toBe(true);
  });

  it("doubles embedded quotes per RFC 4180", () => {
    const csv = keywordsToCsv([makeKeyword({ phrase: 'the "best" crm' })]);
    expect(lines(csv)[1]).toContain('"the ""best"" crm"');
  });

  it("leaves an unranked position empty rather than writing null", () => {
    const csv = keywordsToCsv([makeKeyword({ position: null })]);
    const cells = lines(csv)[1].split(",");
    expect(cells[1]).toBe("");
  });

  it("writes only a header for an empty set", () => {
    expect(lines(keywordsToCsv([]))).toHaveLength(1);
  });
});
