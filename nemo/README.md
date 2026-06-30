# NemoClaw / Hermes setup for Hugo

This guide connects a fresh Hermes profile to the Hugo control plane. Follow every step on
a machine where Hugo is already running (`./setup.sh`).

## Prerequisites

- Hugo stack running at `http://localhost:8000` with a configured `.env`
- NVIDIA API key with access to Nemotron 3 Ultra
- `nemohermes` CLI installed and onboarded

Copy these values from Hugo's `.env` before continuing:

```bash
grep ARGO_AGENT_TOKEN .env
grep ARGO_API_TOKEN .env
```

Hermes needs the **agent token** (`ARGO_AGENT_TOKEN`), not the operator API token.

## 1. Onboard Hermes with Nemotron 3 Ultra

```bash
export NVIDIA_INFERENCE_API_KEY=nvapi-...
export NEMOCLAW_AGENT=hermes
nemohermes onboard
```

In the wizard:

1. Choose **NVIDIA Endpoints**
2. Select or enter `nvidia/nemotron-3-ultra-550b-a55b`
3. Confirm the sandbox is created

Verify:

```bash
nemohermes my-hermes status
```

Expected: model is `nvidia/nemotron-3-ultra-550b-a55b`. Hugo's `/health` endpoint reports
the same model. Do not use NemoClaw's default Nemotron 3 Super model.

## 2. Install the argo-ops plugin

Copy the plugin into the Hermes sandbox and enable it:

```bash
# From the Hugo repo root
cp -r hermes-plugin/argo-ops /sandbox/.hermes/plugins/argo-ops
```

Set Hermes environment variables (add to your Hermes profile or sandbox env):

```bash
export ARGO_INTERNAL_API_URL=http://host.docker.internal:8000
export ARGO_AGENT_TOKEN=<value from Hugo .env>
```

On Linux without `host.docker.internal`, use your host IP or `http://172.17.0.1:8000`.

Verify tools are registered:

```bash
hermes tools list | grep argo_
```

You should see 20 tools including `argo_preflight`, `argo_claim_tasks`, and
`argo_generate_strategy`.

## 3. Install Hugo skills

```bash
cp -r hermes-skills/argo-* /sandbox/.hermes/skills/
```

Required skills:

| Skill | Purpose |
|---|---|
| `argo-strategy-engine` | Budget-safe campaign strategy |
| `argo-creator-discovery` | Creator discovery (influencers.club + research fallback) |
| `argo-outreach-negotiation` | Email outreach and negotiation |
| `argo-performance-learning` | Post-campaign learning |
| `argo-cron-orchestration` | Minute cron loop for durable tasks |
| `argo-platform-intelligence` | Platform playbook research |

## 4. Install official partner skills

```bash
hermes skills install official/payments/stripe-link-cli
npx skills add nvidia/skills --skill nemoclaw-user-guide --yes
npx skills add nvidia/skills --skill skill-card-generator --yes
```

## 5. Apply network policy

Preview and apply the least-privilege broker policy:

```bash
nemohermes my-hermes policy-add --from-file nemo/argo-backend-policy.yaml --dry-run
nemohermes my-hermes policy-add --from-file nemo/argo-backend-policy.yaml --yes
```

The policy allows Hermes to reach:

- Hugo's internal API (`host.docker.internal:8000`)
- NVIDIA inference (`integrate.api.nvidia.com`)
- Stripe Link CLI hosts (`api.stripe.com`, `link.stripe.com`)

Stripe server keys, Gmail tokens, and discovery API keys stay in Hugo's FastAPI process.

If the Stripe Link skill needs additional hosts, approve only the exact endpoints OpenShell
surfaces. Do not grant general egress.

## 6. Enable Hermes cron orchestration

Schedule the cron skill to run every minute. In your Hermes profile:

```bash
# Example: add a cron job that invokes argo-cron-orchestration
hermes cron add --schedule "* * * * *" --skill argo-cron-orchestration
```

The cron loop:

1. Calls `argo_preflight` to check pending tasks
2. Polls email with `argo_poll_emails`
3. Claims up to 5 tasks with `argo_claim_tasks`
4. Dispatches each task to the appropriate `argo_*` tool
5. Completes or fails each task

## 7. Configure Hugo for Hermes-driven orchestration

In Hugo's `.env`, enable Hermes cron mode so the Python worker does not duplicate
lifecycle advancement:

```
ARGO_HERMES_CRON_ACTIVE=true
```

Restart the worker:

```bash
./setup.sh --restart
```

With this flag:

- **Hermes cron** owns strategy, funding, launch, outreach, QA, payouts, and learning tasks
- **Python worker** handles outbox jobs (notifications, scheduled metrics, learning jobs) and
  email polling as a fallback

## 8. Verify end-to-end

1. Open Hugo setup wizard: `http://localhost:3000/setup`
2. Save all required credentials and run **Test connections**
3. Open System page: `http://localhost:3000/system`
4. Click **Run live probe** — confirm Nemotron round-trip succeeds
5. Create a campaign in the cockpit
6. Watch System → **Hermes task queue** for pending/claimed tasks
7. Confirm tasks move from pending → claimed → completed

If tasks fail, use the **Retry** button on the System page.

## Stripe setup (funding and payouts)

Hugo uses Stripe Checkout for campaign funding and Stripe Connect for creator payouts.

### Dashboard configuration

1. Create a Stripe account (test mode is fine for development)
2. Enable Connect (Express accounts)
3. Copy your **Secret key** (`sk_test_...`) and add to `.env`:
   ```
   ARGO_STRIPE_SECRET_KEY=sk_test_...
   ```

### Webhook forwarding (local development)

```bash
stripe listen --forward-to localhost:8000/v1/webhooks/stripe
```

Copy the `whsec_...` signing secret into `.env`:

```
ARGO_STRIPE_WEBHOOK_SECRET=whsec_...
```

Restart Hugo after updating `.env`.

### Test a funding webhook

```bash
stripe trigger checkout.session.completed
```

Or complete a real Checkout session from the cockpit funding button.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `argo_*` tools not found | Re-copy plugin to `/sandbox/.hermes/plugins/argo-ops` and restart Hermes |
| 401 on internal API calls | Verify `ARGO_AGENT_TOKEN` in Hermes env matches Hugo `.env` |
| Network policy blocks | Run `policy-add --dry-run`, approve missing hosts via OpenShell |
| Tasks stay pending | Confirm cron skill is scheduled; check `argo_preflight` returns `should_claim: true` |
| Duplicate lifecycle steps | Set `ARGO_HERMES_CRON_ACTIVE=true` and restart worker |
| Discovery returns empty | influencers.club may be unavailable; Hugo retries with web research automatically |
| Funding not marked succeeded | Confirm Stripe CLI is forwarding webhooks and `ARGO_STRIPE_WEBHOOK_SECRET` matches |

## Service spend flow

Hugo never invokes `link-cli` directly. The flow is:

1. Hermes calls `argo_request_service_spend` to create a capped authorization
2. Hermes uses the installed `official/payments/stripe-link-cli` skill inside the sandbox
3. Operator approves the Link purchase
4. Hermes calls `argo_request_service_spend` again with the outcome
