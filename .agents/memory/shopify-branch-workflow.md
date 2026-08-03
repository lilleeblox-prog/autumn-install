---
name: Shopify branch workflow
description: How the shopify branch works and safe ways to update it
---

The `shopify` branch is an orphan branch on GitHub (`autumn-install` repo) that contains the Shopify theme files at the root level (layout/, sections/, assets/, etc.). Shopify's GitHub integration reads from this branch.

The same files live in `shopify-theme/` on the `main` branch for editing in Replit.

## DANGER: git checkout / worktree kills artifacts
Any `git checkout shopify` or `git worktree add ... shopify` operation causes Replit to deregister all artifacts. This is because the shopify branch doesn't have the `artifacts/` directory, and Replit's file watcher detects the removal.

## Safe update workflow
1. Edit files in `shopify-theme/` on `main` as normal
2. Commit and push `main` via `gitPush({ branch: "main" })`
3. To sync to `shopify` branch: the `gitPush` callback CANNOT push updates to an already-existing remote branch (only creates new ones). Shell `git push` also fails (HTTPS auth not available).

**Current workaround for pushing to shopify branch:**
- The branch has to be deleted and recreated, OR
- Use GitHub web UI to manually sync, OR
- Find another credential mechanism

**Why:** `gitPush` uses GitHub's "publish branch" API which only works for new branches. For updates to existing branches a regular git push is needed, but HTTPS credentials aren't configured for shell.
