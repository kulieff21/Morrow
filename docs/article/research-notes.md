# Article research and editorial plan

Research completed on 14 October 2026. The requested manuscript is entirely English.
This is an original computational case study of Morrow, not a literature review or
an empirical biological study. No new experiment is needed to write it.

## Primary sources consulted before drafting

1. ICMJE. [Preparing a manuscript for submission](https://icmje.org/recommendations/browse/manuscript-preparation/preparing-for-submission.html).
   Use the general Introduction, Methods, Results, Discussion structure and keep
   prespecified and exploratory analyses distinct. The medical submission rules
   do not make this artificial-life study a clinical study.
2. Grimm V et al. (2020). [The ODD Protocol for Describing Agent-Based and Other Simulation Models](https://www.jasss.org/23/2/7.html).
   DOI 10.18564/jasss.4259. Describe the actual implemented entities, scales,
   scheduling, initialization and submodels. Include design rationale and a code map.
3. Morris TP, White IR, Crowther MJ. [Using simulation studies to evaluate statistical methods](https://arxiv.org/abs/1712.03198).
   Author manuscript, revised 2018; published DOI 10.1002/sim.8086 (2019).
   Adapt the explicit separation of aims, generating mechanisms and estimands.
   Morrow evaluates model interventions rather than statistical estimators, so
   do not claim that the full ADEMP framework was implemented prospectively.
4. Sandve GK et al. (2013). [Ten Simple Rules for Reproducible Computational Research](https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1003285).
   DOI 10.1371/journal.pcbi.1003285. Preserve executable analyses, inputs and
   source versions; document the exact replay route.
5. Wilkinson MD et al. (2016). [The FAIR Guiding Principles for scientific data management and stewardship](https://www.nature.com/articles/sdata201618).
   DOI 10.1038/sdata.2016.18. Explain access restrictions honestly. A private Git
   repository and SHA-256 checksums do not establish full FAIR compliance.
6. ICMJE. [Use of AI by authors](https://www.icmje.org/recommendations/browse/artificial-intelligence/ai-use-by-authors.html).
   Disclose AI assistance and human review responsibility. Do not list a chatbot
   as an accountable author or invent a completed human approval process.

## Manuscript structure and claims

Descriptive title; provenance byline; structured abstract; introduction; complete
model and experimental methods; original paired results; four-arm intervention
results; interpretation and limitations; reproducibility and declarations;
references; exhaustive endpoint and parameter appendices.

The observational discovery, post hoc paired analysis and prospectively fixed
follow-up protocol are three stages of the same twelve initial conditions.
Forty-eight four-arm branches are not forty-eight independent replicates. The
natural arms repeat the original endpoints. There is no held-out validation.

Primary result: mean share interaction -12.40 percentage points, median -6.90,
negative in 8/12 seeds. Secondary count interaction +6.50 organisms has the
opposite sign. Explain this scale difference, all ties and extinction rules,
coupled thrift mechanisms, and conditional rather than biological causality.
Do not add significance tests, confidence intervals, mediation percentages,
unrun sensitivity results, public-access promises or publication status.

## Artifact plan

The Markdown manuscript is the source of truth. A reusable Python converter
creates a single-column A4 Word document with editable equations, numbered
tables, repeated table headers, hyperlinks, embedded figures and page numbers.
Figures and appendix tables are generated from existing JSON, never transcribed
from screenshots. Internal rendering files stay in ignored `.local/` on D:.
The final DOCX must be rendered and every page visually inspected.


## Revision 2 and prospective replication

After public release, Elmar authorized a new 100-seed experiment and updates to
all outputs. The replication protocol was pushed before any new outcomes,
followed by tested implementation, then the complete saved batch. The new
bootstrap method and its limitations were researched before execution using
[NIST percentile-bootstrap documentation](https://pages.nist.gov/cmomy/reference/generated/cmomy.confidence_interval.html)
and [Hesterberg's discussion of bootstrap coverage](https://arxiv.org/abs/1411.5279).
These support method reporting; neither establishes exchangeability or coverage
for the chosen deterministic consecutive seed range.

Revision 2 preserves all original scientific evidence, adds a fourth study stage,
reports all new seed endpoints separately, updates the abstract/discussion/access,
and includes the 19 reversed share interactions. The practical count of 100 was
fixed without a formal power or precision calculation; the article says so.
No retrospective interval is attached to the original twelve worlds. No parameter
search, seed replacement, stopping-rule change or new mechanism claim was made.
