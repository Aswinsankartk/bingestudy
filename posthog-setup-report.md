<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into BingeStudy, a Next.js 16 App Router study-group platform. The integration covers client-side event capture with user identification, server-side event capture in API routes, and PostHog exception tracking via the `capture_exceptions` flag.

**New files created:**
- `instrumentation-client.js` — PostHog client-side initialization appended below existing Sentry init
- `lib/posthog-server.js` — Singleton server-side PostHog client using `posthog-node`

**Files modified:**
- `next.config.mjs` — Added `skipTrailingSlashRedirect: true`
- `app/login/page.js` — Identify users on signup/login; capture `user_signed_up`, `user_logged_in`, `google_login_clicked`
- `app/dashboard/page.js` — Identify user on load; capture `group_created`, `group_joined`, `group_deleted`; call `posthog.reset()` on logout
- `app/group/[id]/page.js` — Capture `message_sent`, `file_uploaded`, `ai_question_asked`, `group_left`
- `app/profile/page.js` — Capture `profile_saved`
- `app/api/groups/route.js` — Server-side `group_created_server`
- `app/api/groups/join/route.js` — Server-side `group_joined_server`
- `app/api/upload/route.js` — Server-side `file_uploaded_server`
- `app/api/chat/route.js` — LLM analytics: `$ai_generation` event with model, token counts, latency, and error capture for every Gemini call

**Environment variables added to `.env.local`:**
- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a user successfully registers with email and password. | `app/login/page.js` |
| `user_logged_in` | Fired when a user successfully logs in with email/password. | `app/login/page.js` |
| `google_login_clicked` | Fired when a user clicks the Continue with Google button. | `app/login/page.js` |
| `group_created` | Fired when a user successfully creates a new study group. | `app/dashboard/page.js` |
| `group_joined` | Fired when a user successfully joins a study group using an invite code. | `app/dashboard/page.js` |
| `group_deleted` | Fired when an admin successfully deletes a study group. | `app/dashboard/page.js` |
| `group_left` | Fired when a member leaves a study group. | `app/group/[id]/page.js` |
| `message_sent` | Fired when a user sends a text message in a group chat. | `app/group/[id]/page.js` |
| `file_uploaded` | Fired when a user uploads a file to a group chat. | `app/group/[id]/page.js` |
| `ai_question_asked` | Fired when a user sends a question to the AI study assistant. | `app/group/[id]/page.js` |
| `profile_saved` | Fired when a user saves their profile information. | `app/profile/page.js` |
| `group_created_server` | Server-side event fired when a study group is successfully created via the API. | `app/api/groups/route.js` |
| `group_joined_server` | Server-side event fired when a user successfully joins a group via the API. | `app/api/groups/join/route.js` |
| `file_uploaded_server` | Server-side event fired when a file is successfully uploaded via the API. | `app/api/upload/route.js` |
| `$ai_generation` | PostHog AI generation event capturing model (`gemini-2.5-flash`), provider (`google`), input/output token counts, latency (seconds), session grouping by study group, and error state. | `app/api/chat/route.js` |

## LLM analytics

Every call to the Gemini AI assistant in `app/api/chat/route.js` now emits a `$ai_generation` event to PostHog. The integration uses manual capture via the existing `posthog-node` singleton (`lib/posthog-server.js`) — no additional packages required. Each event includes:

- **`$ai_trace_id`** — a UUID generated per request (identifies one prompt/response pair)
- **`$ai_session_id`** — the study group ID (groups all AI turns within a group conversation)
- **`$ai_model`** / **`$ai_provider`** — `gemini-2.5-flash` / `google`
- **`$ai_input_tokens`** / **`$ai_output_tokens`** — from `response.usageMetadata`
- **`$ai_latency`** — wall-clock time in seconds for the Gemini API call
- **`$ai_is_error`** / **`$ai_error`** — set on Gemini API failures (with early return)

View AI generations and traces in PostHog under [AI Observability → Generations](https://us.posthog.com/ai-observability/generations).

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.posthog.com/project/474158/dashboard/1798073)
- [User Signups & Logins (wizard)](https://us.posthog.com/project/474158/insights/lrKol4Ue)
- [Feature Usage Comparison (wizard)](https://us.posthog.com/project/474158/insights/EMLXMhQJ)
- [Group Creation & Join Activity (wizard)](https://us.posthog.com/project/474158/insights/1wlWBqWb)
- [Group Churn Signals (wizard)](https://us.posthog.com/project/474158/insights/AkMjTebH)
- [User Activation Funnel (wizard)](https://us.posthog.com/project/474158/insights/8s1kfmhd)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any CI/deployment scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently identify is called on login and on dashboard load (from `getUser()`), but verify this covers users who return with an existing Supabase session without re-logging in.
- [ ] Trigger the AI assistant (send a question in a group) and confirm `$ai_generation` events appear in PostHog [AI Observability → Generations](https://us.posthog.com/ai-observability/generations).

### Agent skills

We've left agent skill folders in your project at `.claude/skills/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

- `.claude/skills/integration-nextjs-app-router/` — Next.js App Router product analytics integration
- `.claude/skills/llm-analytics-setup/` — LLM/AI observability for all supported providers

</wizard-report>
