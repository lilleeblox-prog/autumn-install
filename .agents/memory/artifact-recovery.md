---
name: Artifact recovery
description: How to re-register Replit artifacts after they are deregistered (e.g. after branch operations)
---

When artifacts are removed from the Replit registry (you'll see automatic updates saying "Removed artifact"), call `verifyAndReplaceArtifactToml` for each artifact using its existing `.replit-artifact/artifact.toml` as both `tempFilePath` and `artifactTomlPath`. This re-registers them without needing the artifacts skill.

```js
await verifyAndReplaceArtifactToml({
  tempFilePath: "/home/runner/workspace/artifacts/seasonal-install/.replit-artifact/artifact.toml",
  artifactTomlPath: "/home/runner/workspace/artifacts/seasonal-install/.replit-artifact/artifact.toml"
});
```

**Why:** The artifact skill YAML files are missing from `.local/skills/artifacts/`, so `createArtifact` fails. `verifyAndReplaceArtifactToml` works without those files.

**How to apply:** Any time you see "Removed artifact" in automatic updates, immediately call this for all three artifacts in parallel.
