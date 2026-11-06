# Publication workflow

The user requires changes to be edited, tested, committed and pushed to GitHub without automatically deploying Netlify. Only publish when the user explicitly requests a deploy.

- Every commit pushed without explicit deployment authorization must include `[skip netlify]` in its commit message. Netlify recognizes this marker to skip the automatic build for that commit.
- Do not invoke Netlify deploy commands, build hooks or deployment triggers without explicit user authorization.
- Do not remove skip markers, create an unmarked follow-up commit or force a build merely to verify a code change.
- Prefer local/browser tests with mocked submissions; read-only checks do not establish deployment.
- Report GitHub updates and live publication as separate outcomes.

# Form requirements

Name and WhatsApp are required. Age must remain visible and optional on both city pages and signup variants. Simplification does not authorize deleting the age field. Keep the per-city spreadsheet destinations separate.
