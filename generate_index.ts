import { expandGlob } from "https://deno.land/std@0.157.0/fs/expand_glob.ts";
import { parse as parse_yaml } from "https://deno.land/std@0.157.0/encoding/yaml.ts";
import { assert } from "https://deno.land/std@0.157.0/_util/assert.ts";

const manifests: string[] = [];

for await (const file of expandGlob("gears/*/*/manifest.yaml")) {
  const body = await Deno.readTextFile(file.path);
  manifests.push(body);
}

function sortManifests(a: string, b: string) {
  // deno-lint-ignore no-explicit-any
  const parsedA: any = parse_yaml(a);
  // deno-lint-ignore no-explicit-any
  const parsedB: any = parse_yaml(b);
  return parsedA.id > parsedB.id ? 1 : -1;
}

manifests.sort(sortManifests);

Deno.writeTextFileSync("gears_index.yaml", manifests.join("---\n"));
