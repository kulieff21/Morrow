# First experiment — October 14, 2026

Question: does a lineage that leads in abundance retain leadership during scarcity?

Protocol: eight days at resource renewal 1.0, fork the exact state, then eight days
at 1.0 (control) and 0.15 (drought). Mutation 0.08, seasons off. Seeds 4217–4228 were
chosen consecutively before running this batch. Counts are living organisms.

| Seed | Checkpoint population | Control end | Drought end | Checkpoint leader(s) | Drought leader(s) | Lead retained |
| ---: | ---: | ---: | ---: | --- | --- | --- |
| 4217 | 162 | 139 | 14 | Filiz | Filiz | Yes |
| 4218 | 150 | 149 | 13 | Yankı | Çiy | No |
| 4219 | 172 | 153 | 19 | Çiy | Çiy | Yes |
| 4220 | 161 | 155 | 15 | Filiz | Filiz | Yes |
| 4221 | 163 | 136 | 12 | Köz, Filiz | Köz | Yes |
| 4222 | 177 | 149 | 13 | Filiz | Çiy | No |
| 4223 | 169 | 147 | 10 | Filiz | Filiz | Yes |
| 4224 | 162 | 148 | 16 | Filiz | Çiy | No |
| 4225 | 177 | 152 | 12 | Yankı | Filiz | No |
| 4226 | 166 | 156 | 10 | Yankı | Çiy | No |
| 4227 | 155 | 132 | 13 | Yankı | Filiz | No |
| 4228 | 156 | 152 | 15 | Yankı | Filiz | No |

Five runs retained at least one checkpoint leader, seven changed leaders, and none
had undefined leadership. Seed 4221 has a checkpoint tie, handled explicitly.

Within these runs, abundance leadership did not guarantee drought leadership.
That is a descriptive statement about this selected rule system and seed range.
Twelve consecutive seeds are not proof of a biological mechanism or a precise
estimate of leadership persistence in other simulations. The same set rerun
unchanged gives the same numbers and is not twelve new independent observations.

Reproduce with `npm run experiment`. Machine-readable full reports, including
every lineage's counts and the protocol, are in [initial-batch.json](initial-batch.json).
The CLI output has the same schema. See [model assumptions](model.md) before
interpreting the result.

Next questions worth testing: does the result depend on the drought duration?
Does the shift come mainly from between-lineage replacement or within-lineage
mutation? Neither was answered in this first version.

## Paired follow-up on the same records

The [paired endpoint analysis](paired-analysis.md) now compares control and drought
at the same day-16 endpoint. Baseline leadership changes in 3 control branches and
7 drought branches; the 7/12 figure by itself does not isolate an effect of drought.
Final leader sets are disjoint in nine pairs. This follow-up uses the original
batch unchanged and adds no new experiment trials. The duration and gene-mechanism
questions above remain unanswered.

A later [targeted thrift intervention](thrift-results.md) examines the Çiy
parameter with four branches per checkpoint. It addresses one coupled gene
intervention; it does not isolate individual physiological pathways or answer
the drought-duration question.
