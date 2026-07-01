# Hugo: AI-Powered Influencer Campaign Automation
## Hermes Agent Accelerated Business Hackathon — Video Script & Architecture Document
### NVIDIA x Stripe x Nous Research

---

## VIDEO SCRIPT (2 minutes 20 seconds max)

### SECTION 1: The Problem (0:00–0:18)

> **[SCREEN: Show the Hugo cockpit overview page]**
>
> Running an influencer marketing campaign today means weeks of manual work — finding creators,
> sending fixed creator offers, managing payments, checking content quality. A single campaign can involve
> hundreds of emails, spreadsheets, and payment transfers.
>
> Hugo automates the entire lifecycle with Hermes agents running on NemoClaw, from strategy
> generation to creator payout — safely, autonomously, and at scale.

---

### SECTION 2: Architecture Overview (0:18–0:55)

> **[SCREEN: Show architecture flowchart — see ARCHITECTURE FLOWCHART below]**
>
> Here's how Hugo works. At the core, Hermes agents powered by Nemotron 3 Ultra run inside
> NVIDIA's NemoClaw safe execution runtime. The agents communicate with Hugo's FastAPI
> control plane through a policy-enforced plugin — every action goes through the backend's
> state machine, never directly to external services.
>
> **[SCREEN: Highlight the NVIDIA stack]**
>
> On the NVIDIA side: Nemotron 3 Ultra — the 550-billion-parameter model — handles strategy
> generation, outreach drafting, creator response handling, and post-campaign learning. Nemotron Nano 12B,
> the vision model, runs two-stage QA on every deliverable — checking brand safety, FTC
> disclosure, and tracking link compliance before any payment is released.
>
> **[SCREEN: Highlight the Stripe stack]**
>
> On the Stripe side: Checkout funds campaigns, Connect onboards creators as Express accounts,
> and Transfers handles automated payouts — all with idempotency keys and a double-entry
> ledger. Stripe Link provides service spend for discovery credits through influencers.club.
>
> **[SCREEN: Show the campaign state machine — see STATE MACHINE FLOWCHART below]**
>
> Every campaign follows a strict 10-state machine — from draft through strategy, funding,
> active discovery, measurement, to completion. The agent can't skip states or exceed budget caps.
> Three policy modes let the operator choose their autonomy level.

---

### SECTION 3: Live Demo Walkthrough (0:55–1:55)

> **[SCREEN: Show Hugo setup wizard at localhost:3000/setup]**
>
> Let's run a real campaign. First, the setup wizard — enter your NVIDIA API key, Stripe keys,
> and email credentials. Hugo validates each connection live.
>
> **[SCREEN: Show System page with live probe results]**
>
> The System page confirms Nemotron 3 Ultra is responding through NemoClaw, vision QA is online,
> Stripe Connect is ready, and Gmail is authenticated.
>
> **[SCREEN: Create a new campaign in the cockpit]**
>
> We create a campaign: "Summer Glow Serum Launch" for a skincare brand, $500 budget on TikTok,
> set to full autonomy mode.
>
> **[SCREEN: Show strategy generation happening — strategy tab fills in]**
>
> Hermes generates a strategy — it recommends micro creators, $100 per post, projects a $0.019
> cost per view. It references the TikTok algorithm playbook it researched for current ranking signals.
>
> **[SCREEN: Show Stripe Checkout opening for funding]**
>
> Campaign funding goes through Stripe Checkout. The payment webhook fires, Hugo marks the campaign
> funded and automatically launches discovery.
>
> **[SCREEN: Show creators tab populating with discovered creators]**
>
> The agent discovers creators — each scored with weighted fit: 30% niche match, 20% audience quality,
> 20% brand fit, 15% engagement rate, 15% reputation. Creators below the brand's minimum score are
> auto-rejected. Policy evaluation runs on every creator.
>
> **[SCREEN: Show outreach emails being sent, deal pipeline updating]**
>
> Outreach emails go out through Gmail — each drafted by Hermes with the rate, deliverable
> requirements, two-stage QA process, and FTC disclosure rules. The deal pipeline tracks
> 16 states from discovered through transferred.
>
> **[SCREEN: Show QA check results with vision model findings]**
>
> When content comes in, Nemotron Nano runs visual QA — checking brand safety, verifying the
> product is visible, confirming the disclosure tag and tracking link are present. Failed checks
> trigger revision requests automatically.
>
> **[SCREEN: Show payout in finance tab with ledger entries]**
>
> Once QA passes and metrics are measured, Stripe Connect transfers the payout directly to the
> creator's connected account. Every dollar is tracked in a double-entry ledger.
>
> **[SCREEN: Show learning tab with strategy priors updating]**
>
> After completion, Hermes runs a learning cycle — analyzing what worked, updating strategy
> priors in the database, and optionally patching its own skills for the next campaign.

---

### SECTION 4: Why This Matters (1:55–2:15)

> **[SCREEN: Show System page with all green capabilities]**
>
> Hugo is a fully autonomous business operation. The agent earns revenue through campaign execution,
> spends through Stripe Link for discovery credits, and runs real operations — email, payments,
> content QA, learning — all through NemoClaw's safe execution sandbox.
>
> This isn't a wrapper around an API. It's a complete business function that gets smarter with
> every campaign it runs.

---

### CLOSING (2:15–2:20)

> **[SCREEN: Show Hugo logo / overview dashboard]**
>
> Hugo. Autonomous influencer operations, powered by Hermes, NVIDIA, and Stripe.

---

## ARCHITECTURE FLOWCHARTS

### 1. System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           HUGO SYSTEM ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────┐         ┌──────────────────────────────────────┐  │
│  │   OPERATOR COCKPIT  │         │        HERMES AGENT (NemoClaw)       │  │
│  │   (Next.js / React) │         │                                      │  │
│  │                     │         │  ┌─────────────────────────────────┐  │  │
│  │  • Campaign creation│         │  │  Nemotron 3 Ultra (550B)        │  │  │
│  │  • Strategy review  │         │  │  • Strategy generation          │  │  │
│  │  • Approval queue   │         │  │  • Outreach drafting            │  │  │
│  │  • Finance dashboard│         │  │  • Creator response analysis    │  │  │
│  │  • Learning insights│         │  │  • Platform playbook research   │  │  │
│  │  • System monitoring│         │  │  • Post-campaign learning       │  │  │
│  └────────┬────────────┘         │  └─────────────────────────────────┘  │  │
│           │                      │                                      │  │
│           │  REST API            │  ┌─────────────────────────────────┐  │  │
│           │  (Token Auth)        │  │  hugo-ops Plugin (19 tools)     │  │  │
│           ▼                      │  │  • hugo_generate_strategy       │  │  │
│  ┌────────────────────────────┐  │  │  • hugo_request_discovery      │  │  │
│  │    HUGO CONTROL PLANE      │  │  │  • hugo_request_outreach       │  │  │
│  │    (FastAPI + PostgreSQL)   │  │  │  • hugo_process_creator_reply  │  │  │
│  │                            │◄─┤  │  • hugo_request_qa             │  │  │
│  │  • Campaign state machine  │  │  │  • hugo_request_payout         │  │  │
│  │  • Policy enforcement      │  │  │  • hugo_begin/commit_learning  │  │  │
│  │  • Budget validation       │  │  │  • hugo_claim/complete_tasks   │  │  │
│  │  • Double-entry ledger     │  │  │  • hugo_poll_emails            │  │  │
│  │  • Durable task queue      │  │  └─────────────────────────────────┘  │  │
│  │  • Approval gate system    │  │                                      │  │
│  └─┬──────┬──────┬──────┬─────┘  │  ┌─────────────────────────────────┐  │  │
│    │      │      │      │        │  │  Hermes Skills (6 skills)       │  │  │
│    │      │      │      │        │  │  • hugo-cron-orchestration      │  │  │
│    │      │      │      │        │  │  • hugo-outreach                │  │  │
│    │      │      │      │        │  │  • hugo-browser-email           │  │  │
│    │      │      │      │        │  │  • hugo-strategy-engine         │  │  │
│    ▼      ▼      ▼      ▼       │  │  • hugo-performance-learning    │  │  │
│  ┌────┐┌────┐┌─────┐┌──────┐    │  │  • hugo-platform-intelligence   │  │  │
│  │NVDA││Strp││Gmail││Disc. │    │  └─────────────────────────────────┘  │  │
│  │NIM ││API ││ API ││ API  │    └──────────────────────────────────────┘  │
│  └────┘└────┘└─────┘└──────┘                                             │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                    EXTERNAL SERVICES                                 │  │
│  │                                                                      │  │
│  │  NVIDIA                    STRIPE                    COMMS           │  │
│  │  ├─ Nemotron 3 Ultra       ├─ Checkout (funding)     ├─ Gmail API   │  │
│  │  │  (strategy/outreach)    ├─ Connect (onboarding)   ├─ Browser     │  │
│  │  ├─ Nemotron Nano 12B VL   ├─ Transfers (payouts)    │  email mode  │  │
│  │  │  (visual QA)            ├─ Link (service spend)   └─ Telegram    │  │
│  │  └─ NemoClaw (sandbox)     └─ Webhooks (events)        (approvals)  │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2. Campaign State Machine

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    CAMPAIGN STATE MACHINE (10 states)                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│    ┌───────┐    Hermes generates     ┌──────────────────┐              │
│    │ DRAFT │───strategy + playbook──▶│ STRATEGY_PENDING │              │
│    └───────┘                         └────────┬─────────┘              │
│                                               │                        │
│                              Policy check: operation_mode              │
│                           ┌───────────────────┼───────────────┐        │
│                           ▼                   ▼               ▼        │
│                    ┌─────────────┐   ┌──────────────┐  ┌───────────┐  │
│                    │ full_autonomy│   │strategy_      │  │strategy_  │  │
│                    │ (auto-approve│   │creators       │  │creators_  │  │
│                    │  everything) │   │(approve       │  │payments   │  │
│                    └──────┬──────┘   │ creators only)│  │(approve   │  │
│                           │          └───────┬──────┘  │ all)       │  │
│                           ▼                  ▼         └─────┬─────┘  │
│                  ┌────────────────────┐                      │         │
│                  │ AWAITING_APPROVAL  │◄─────────────────────┘         │
│                  └────────┬───────────┘                                │
│                           │ Operator approves strategy                 │
│                           ▼                                            │
│                  ┌─────────────────┐                                   │
│                  │ AWAITING_FUNDING │                                   │
│                  └────────┬────────┘                                   │
│                           │ Stripe Checkout completes                  │
│                           │ (webhook: checkout.session.completed)      │
│                           ▼                                            │
│                  ┌────────────────┐                                    │
│                  │     ACTIVE     │◄─────── Hermes discovers creators  │
│                  │                │         sends fixed offers          │
│                  │  • Discovery   │         manages deal pipeline       │
│                  │  • Outreach    │                                     │
│                  │  • Acceptance  │                                     │
│                  │  • QA (2-stage)│                                     │
│                  │  • Payouts     │                                     │
│                  └────────┬───────┘                                    │
│                           │ Measurement window expires                 │
│                           ▼                                            │
│                  ┌────────────────┐                                    │
│                  │   MEASURING    │  YouTube/platform metrics collected │
│                  └────────┬───────┘                                    │
│                           │ All payouts settled                        │
│                           ▼                                            │
│                  ┌────────────────┐                                    │
│                  │   COMPLETED    │  Learning run begins               │
│                  └────────────────┘  Strategy priors updated           │
│                                      Skills optionally patched         │
│                                                                        │
│  (Any state) ──▶ CANCELLED / FAILED  (operator or system action)      │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3. Deal Lifecycle (16 States)

```
┌──────────────────────────────────────────────────────────────────────┐
│                        DEAL LIFECYCLE                                │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  DISCOVERED ──▶ EVALUATING ──▶ APPROVED ──▶ OUTREACH_QUEUED         │
│       │              │             │              │                   │
│       ▼              ▼             │              ▼                   │
│   REJECTED     Policy gate:       │        OUTREACH_SENT             │
│                min_fit_score,     │              │                   │
│                max_fake_%,        │              ▼                   │
│                operation_mode     │   CONTACTED (accept/decline)     │
│                                   │         │          │             │
│                                   │    ┌────┘          ▼             │
│                                   │    │         ESCALATED           │
│                                   │    │    (operator reviews)       │
│                                   │    │              │              │
│                                   │    ▼              ▼              │
│                                   │  ACCEPTED ◄──────┘              │
│                                   │    │                             │
│                                   │    ▼                             │
│                                   │  ONBOARDING (Stripe Connect)    │
│                                   │    │                             │
│                                   │    ▼                             │
│                                   │  SUBMITTED ──▶ DRAFT_QA         │
│                                   │                   │              │
│                                   │    ┌──────────────┤              │
│                                   │    ▼              ▼              │
│                                   │  DRAFT_APPROVED  REVISION_REQ   │
│                                   │    │              │              │
│                                   │    ▼              │ (re-submit)  │
│                                   │  FINAL_QA ◄──────┘              │
│                                   │    │                             │
│                                   │    ▼                             │
│                                   │  VERIFIED ──▶ TRANSFERRED       │
│                                   │                (Stripe payout)   │
│                                   │                                  │
│                                   │  REPLACED (if QA fails too many  │
│                                   │   times, agent finds replacement)│
│                                   │                                  │
│                                   │  DECLINED (creator declines)     │
│                                   │  REJECTED (policy / operator)    │
└──────────────────────────────────────────────────────────────────────┘
```

### 4. Hermes Cron Orchestration Loop

```
┌──────────────────────────────────────────────────────────────────┐
│               HERMES CRON LOOP (every 60 seconds)                │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────┐                                             │
│  │  hugo_preflight │──▶ Check pending/claimed/failed counts     │
│  └───────┬────────┘                                             │
│          │                                                       │
│          ▼  should_claim = false?  ──▶  EXIT (nothing to do)    │
│          │                                                       │
│          ▼  should_claim = true                                  │
│  ┌──────────────────┐                                           │
│  │  hugo_poll_emails │──▶ Advance open email threads            │
│  └───────┬──────────┘                                           │
│          ▼                                                       │
│  ┌──────────────────┐                                           │
│  │ hugo_claim_tasks  │──▶ Claim up to 5 tasks (180s lease)      │
│  │   (limit=5)       │                                          │
│  └───────┬──────────┘                                           │
│          │                                                       │
│          ▼  For each claimed task, dispatch by task_type:        │
│  ┌──────────────────────────────────────────────────────┐       │
│  │  strategy     → hugo_generate_strategy               │       │
│  │  discovery    → hugo_request_discovery               │       │
│  │  outreach     → hugo_request_outreach                │       │
│  │  browser_email→ Browser tools + hugo_confirm_browser │       │
│  │  response     → hugo_process_creator_response        │       │
│  │  funding      → hugo_create_funding                  │       │
│  │  launch       → hugo_launch_campaign                 │       │
│  │  qa           → hugo_request_qa                      │       │
│  │  payout       → hugo_request_payout                  │       │
│  │  learning     → hugo_begin_learning + commit         │       │
│  │  notify       → hugo_notify_operator                 │       │
│  └──────────┬───────────────────────────────────────────┘       │
│             │                                                    │
│             ├──success──▶ hugo_complete_task(result)             │
│             └──failure──▶ hugo_fail_task(error)                  │
│                                                                  │
│  Lease expires after 180s → task reverts to pending              │
│  Attempt counter increments on every claim                       │
└──────────────────────────────────────────────────────────────────┘
```

### 5. Money Flow (Stripe Integration)

```
┌──────────────────────────────────────────────────────────────────┐
│                     STRIPE MONEY FLOW                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  CAMPAIGN FUNDING                                                │
│  ─────────────────                                               │
│  Brand/Operator                                                  │
│       │                                                          │
│       ▼                                                          │
│  Stripe Checkout Session                                         │
│  (campaign budget as line item)                                  │
│       │                                                          │
│       ▼  Webhook: checkout.session.completed                     │
│  PaymentIntent recorded ──▶ FundingPayment row                  │
│  Source charge resolved  ──▶ LedgerEntry (campaign_funded)       │
│       │                                                          │
│       ▼                                                          │
│  Campaign transitions to AWAITING_FUNDING → ACTIVE              │
│                                                                  │
│  CREATOR PAYOUTS                                                 │
│  ────────────────                                                │
│  Creator accepts deal                                            │
│       │                                                          │
│       ▼                                                          │
│  Stripe Connect onboarding (Express account)                     │
│  account_id stored on Creator row                                │
│       │                                                          │
│       ▼  Content passes two-stage QA                             │
│  Payout calculated:                                              │
│  ┌──────────────────────────────────────────┐                   │
│  │ base      → flat rate per deliverable    │                   │
│  │ cpm       → (views / 1000) × rate        │                   │
│  │ engagement→ engagements × rate           │                   │
│  │ affiliate → conversions × rate           │                   │
│  │ hybrid    → multiple components combined │                   │
│  └──────────────────────────────────────────┘                   │
│       │                                                          │
│       ▼  Budget validation (remaining ≥ payout)                  │
│  Stripe Transfer                                                 │
│  (destination = creator's Connect account,                       │
│   source_transaction = campaign's source charge,                 │
│   transfer_group = campaign_id,                                  │
│   idempotency_key = unique per payout)                           │
│       │                                                          │
│       ▼                                                          │
│  LedgerEntry (payout_released) ──▶ Double-entry accounting      │
│                                                                  │
│  SERVICE SPEND (Discovery Credits)                               │
│  ──────────────────────────────────                              │
│  Hermes ──▶ hugo_request_service_spend (capped authorization)   │
│         ──▶ Stripe Link CLI (inside NemoClaw sandbox)            │
│         ──▶ hugo_request_service_spend (outcome recorded)        │
│         ──▶ LedgerEntry (service_spend)                          │
└──────────────────────────────────────────────────────────────────┘
```

### 6. Two-Stage QA Pipeline (NVIDIA Vision)

```
┌──────────────────────────────────────────────────────────────────┐
│            TWO-STAGE CONTENT QA PIPELINE                         │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Creator submits content (caption + media URL)                   │
│       │                                                          │
│       ▼                                                          │
│  ┌─────────────────────────────────────────────┐                │
│  │  STAGE 1: DRAFT QA                          │                │
│  │                                              │                │
│  │  Text-policy checks (Python):               │                │
│  │  • #ad or "sponsored" present? (FTC)        │                │
│  │  • hugo.link/ tracking URL present?         │                │
│  │                                              │                │
│  │  Vision check (Nemotron Nano 12B VL):       │                │
│  │  • Brand safety assessment                  │                │
│  │  • Product visibility verification          │                │
│  │  • Overall compliance verdict               │                │
│  └──────────────┬──────────────────────────────┘                │
│                 │                                                │
│          ┌──────┴──────┐                                        │
│          ▼             ▼                                        │
│       PASSED        FAILED                                      │
│          │             │                                        │
│          ▼             ▼                                        │
│    DRAFT_APPROVED   REVISION_REQUIRED                           │
│          │             │                                        │
│          │             └──▶ Creator revises and resubmits       │
│          ▼                                                      │
│  ┌─────────────────────────────────────────────┐                │
│  │  STAGE 2: FINAL QA                          │                │
│  │  (Same checks as Stage 1, stricter)         │                │
│  │                                              │                │
│  │  If fails: REPLACED (agent finds new creator)│                │
│  └──────────────┬──────────────────────────────┘                │
│                 │                                                │
│          ┌──────┴──────┐                                        │
│          ▼             ▼                                        │
│       PASSED        FAILED                                      │
│          │             │                                        │
│          ▼             ▼                                        │
│      VERIFIED      REPLACED                                    │
│          │         (replacement creator found)                  │
│          ▼                                                      │
│      TRANSFERRED                                                │
│      (Stripe payout released)                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 7. Self-Improving Learning Cycle

```
┌──────────────────────────────────────────────────────────────────┐
│              POST-CAMPAIGN LEARNING CYCLE                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Campaign reaches terminal state (completed/cancelled/failed)    │
│       │                                                          │
│       ▼                                                          │
│  LearningRun created ──▶ HermesTask enqueued (type=learning)    │
│       │                                                          │
│       ▼                                                          │
│  build_learning_dossier()                                        │
│  ┌──────────────────────────────────────────────┐               │
│  │ Collects evidence:                           │               │
│  │ • Campaign config (budget, rates, model)     │               │
│  │ • Strategy rationale + projected CPR         │               │
│  │ • Actual outcomes (views, engagements, CPR)  │               │
│  │ • Deal outcomes (accepted, countered, etc.)  │               │
│  │ • QA pass/fail rates                         │               │
│  │ • Creator reputation scores                  │               │
│  │ • Ledger summary (funded, spent, remaining)  │               │
│  │ • Algorithm playbook signals used            │               │
│  └──────────────────────┬───────────────────────┘               │
│                         │                                        │
│                         ▼                                        │
│  Hermes analyzes dossier (Nemotron 3 Ultra)                      │
│       │                                                          │
│       ├──▶ change_type = "patch"                                │
│       │      • Updates StrategyPrior (niche, tier, win_rate)    │
│       │      • Patches SkillVersion (content_hash, governance)  │
│       │      • Safety check: blocks secrets/PII in content      │
│       │                                                          │
│       └──▶ change_type = "no_op"                                │
│              • Records no_op_reason                              │
│              • Still updates observation counts                  │
│                                                                  │
│  Result: Next campaign in same niche starts with better priors   │
└──────────────────────────────────────────────────────────────────┘
```

---

## HACKATHON FIT

### How Hugo Uses Each Sponsor Technology

| Sponsor | Technology | Hugo's Usage |
|---------|-----------|--------------|
| **NVIDIA** | Nemotron 3 Ultra (550B) | Strategy generation, outreach drafting, playbook research, post-campaign learning |
| **NVIDIA** | Nemotron Nano 12B V2 VL | Two-stage visual QA on every deliverable (brand safety, disclosure, tracking) |
| **NVIDIA** | NemoClaw | Safe execution runtime — agents run in sandboxed environment with least-privilege network policy |
| **Stripe** | Checkout | Campaign funding sessions |
| **Stripe** | Connect (Express) | Creator onboarding and identity verification |
| **Stripe** | Transfers | Automated payouts with idempotency and source charge linking |
| **Stripe** | Link CLI | Service spend for discovery API credits (influencers.club) |
| **Stripe** | Webhooks | Real-time payment event processing (funded, failed, account updated) |
| **Nous Research** | Hermes Agents | Autonomous agent runtime with plugin system, skill management, cron scheduling |
| **Nous Research** | Hermes Plugin System | 19-tool hugo-ops plugin for policy-enforced backend communication |
| **Nous Research** | Hermes Skills | 6 custom skills governing outreach, browser email, learning, and cron operations |

### Judging Criteria Mapping

**Usefulness:**
- Influencer marketing is a $21B+ industry dominated by manual processes
- Hugo automates the entire lifecycle: strategy → discovery → fixed offer → acceptance → QA → payout → learning
- Configurable autonomy levels let operators choose their comfort level
- Self-improving: each campaign updates strategy priors for the next one

**Viability:**
- Production-grade architecture: PostgreSQL, Alembic migrations, Docker Compose
- 10-state campaign machine with enforced transitions — no illegal state jumps
- Fixed-offer deal lifecycle with acceptance, decline, and replacement logic
- Double-entry ledger tracks every dollar
- Idempotency keys on all payments and emails prevent double-processing
- Policy gates enforce budget caps, fit score minimums, fake follower limits
- NemoClaw network policy restricts agent to only approved endpoints
- Demo mode for presentations, hybrid mode for partial API key setups
- Safety checks block secrets/PII from entering learning content

**Presentation:**
- Clean operator cockpit with campaign workspace (7 tabs: summary, strategy, creators, deliverables, finance, learning, activity)
- Real-time task monitoring with preflight status and retry controls
- System page with live probes showing model latency and connection health
- Setup wizard validates all credentials before first campaign

---

## KEY DIFFERENTIATORS

1. **The agent earns, spends, and runs real operations** — Hugo isn't a chatbot wrapper. The Hermes agent handles campaign funding (Stripe Checkout), spends budget on discovery credits (Stripe Link), and pays creators (Stripe Transfers). Real money flows.

2. **Policy-gated autonomy** — Three operation modes (full_autonomy, strategy_creators, strategy_creators_payments) let operators dial how much the agent can do without approval. Every sensitive action checks the policy gate.

3. **Two-stage visual QA** — Nemotron Nano 12B vision model inspects every deliverable for brand safety, FTC compliance, and tracking link presence before any payment is released. This prevents non-compliant content from going live.

4. **Self-improving learning** — After each campaign, Hermes analyzes outcomes and updates strategy priors in the database. Over time, the system recommends better creator tiers, rates, and platforms based on real performance data.

5. **Durable task orchestration** — The lease-based HermesTask queue ensures no work is lost. If a task lease expires, it reverts to pending. Attempt counters detect stuck tasks. The cron loop runs every minute.

6. **Complete financial accountability** — Double-entry ledger, source charge linking for Connect transfers, idempotency keys on every payout, and budget cap enforcement at every spending decision.

---

## DEMO TIPS

- **Use demo mode** for the video if API keys aren't available — `HUGO_DEMO_MODE=true` provides synthetic data through the full lifecycle
- **Use hybrid mode** if you have some API keys — set `HUGO_DEMO_REAL_PROVIDERS=hermes,stripe` to use real providers for those, demo for the rest
- **Show the System page** early — the live probe demonstrates real Nemotron round-trip through NemoClaw
- **Show the Hermes task queue** — watching tasks move from pending → claimed → completed demonstrates real orchestration
- **Show the ledger** — every dollar tracked, making the financial accountability tangible
- **Mention the learning cycle** — this is what makes it a "business that gets smarter," not just an automation

---

## DOCKER QUICK START

```bash
# Clone and start
git clone <repo>
cp .env.example .env
# Edit .env with your API keys (or set HUGO_DEMO_MODE=true)

# Start all services
docker compose up -d

# Services:
# PostgreSQL    → localhost:5432
# Hugo API      → localhost:8000
# Hugo Frontend → localhost:3000

# Open setup wizard
open http://localhost:3000/setup
```

---

## TECH STACK SUMMARY

| Layer | Technology |
|-------|-----------|
| Agent Runtime | Hermes + NemoClaw |
| LLM (Strategy/Outreach) | NVIDIA Nemotron 3 Ultra 550B |
| Vision QA | NVIDIA Nemotron Nano 12B V2 VL |
| Backend | Python / FastAPI / SQLAlchemy |
| Database | PostgreSQL 16 |
| Migrations | Alembic |
| Frontend | Next.js / React / TanStack Query |
| Payments | Stripe (Checkout, Connect, Transfers, Link) |
| Email | Gmail API / Browser automation |
| Notifications | Telegram Bot API |
| Containerization | Docker Compose |
| Metrics | YouTube Data API |
