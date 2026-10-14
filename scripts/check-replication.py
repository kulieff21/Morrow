"""Independently audit saved replication endpoints and paired bootstrap in Python.

Uses only the standard library and never runs the ecological engine.
"""
from pathlib import Path
import json, hashlib, math
from statistics import mean, median

root = Path(__file__).resolve().parents[1]
raw = json.loads((root / 'docs/replication-raw.json').read_text(encoding='utf-8'))
report = json.loads((root / 'docs/replication-analysis.json').read_text(encoding='utf-8'))
arms = ['naturalAbundance', 'naturalDrought', 'normalizedAbundance', 'normalizedDrought']
assert raw['seeds'] == list(range(10000, 10100))
assert len(raw['runs']) == report['sampleSize'] == 100
assert raw['branchRuns'] == report['branchRuns'] == 400
for name, expected in raw['frozenSha256'].items():
    assert hashlib.sha256((root / name).read_bytes()).hexdigest() == expected, name
assert hashlib.sha256((root / 'scripts/replication.mjs').read_bytes()).hexdigest() == raw['runnerSha256']
assert hashlib.sha256((root / 'docs/replication-raw.json').read_bytes()).hexdigest() == report['source']['sha256']
computed = []
for index, record in enumerate(raw['runs']):
    saved = report['runs'][index]
    assert record['seed'] == saved['seed'] == 10000 + index
    assert record['checkpoint']['tick'] == 960
    expected_edits = [{'id': a['id'], 'before': a['genes']['thrift'], 'after': 1}
                      for a in record['checkpoint']['agents'] if a['lineage'] == 1]
    assert record['edits'] == expected_edits
    assert saved['editedOrganisms'] == len(expected_edits)
    counts, shares = [], []
    for name in arms:
        stats = record['final'][name]['stats']
        assert stats['day'] == 16
        assert sum(r['count'] for r in stats['lineages']) == stats['population']
        count = stats['lineages'][1]['count']
        share = count / stats['population'] * 100 if stats['population'] else None
        assert saved['arms'][name]['count'] == count
        assert saved['arms'][name]['population'] == stats['population']
        assert saved['arms'][name]['sharePercent'] == share
        counts.append(count); shares.append(share)
    ci = (counts[3] - counts[1]) - (counts[2] - counts[0])
    si = None if None in shares else (shares[3] - shares[1]) - (shares[2] - shares[0])
    assert saved['count']['interaction'] == ci and saved['share']['interaction'] == si
    computed.append((ci, si))

def bootstrap(values):
    eligible = [v for v in values if v is not None]
    if not eligible: return None
    state = 20261014
    means = []
    for _ in range(20000):
        total = 0
        for _ in eligible:
            state = (state + 0x6D2B79F5) & 0xffffffff
            t = ((state ^ (state >> 15)) * (state | 1)) & 0xffffffff
            t ^= (t + (((t ^ (t >> 7)) * (t | 61)) & 0xffffffff)) & 0xffffffff
            random = ((t ^ (t >> 14)) & 0xffffffff) / 4294967296
            total += eligible[math.floor(random * len(eligible))]
        means.append(total / len(eligible))
    means.sort()
    def q(p):
        j = (len(means)-1)*p
        low = math.floor(j)
        return means[low] + (j-low)*(means[math.ceil(j)]-means[low])
    return [q(.025), q(.975)]

for metric, column in [('count', 0), ('share', 1)]:
    values = [row[column] for row in computed]
    eligible = [v for v in values if v is not None]
    s = report['effects'][metric]['interaction']
    assert s['n'] == len(eligible)
    assert math.isclose(s['mean'], mean(eligible), abs_tol=1e-12)
    assert s['median'] == median(eligible) and s['range'] == [min(eligible), max(eligible)]
    assert [s[k] for k in ['negative', 'zero', 'positive']] == [sum(v < 0 for v in eligible), sum(v == 0 for v in eligible), sum(v > 0 for v in eligible)]
    interval = bootstrap(values)
    for a, b in zip(interval, report['bootstrap'][metric]['interval']):
        assert math.isclose(a, b, abs_tol=1e-10), (metric, a, b)
    print(metric, 'mean', s['mean'], 'interval', interval, 'signs', s['negative'], s['zero'], s['positive'])
decision = 'criterion-met' if report['effects']['share']['interaction']['n'] == 100 and report['effects']['share']['interaction']['mean'] < 0 and report['bootstrap']['share']['interval'][1] < 0 else 'inconclusive'
assert report['decision'] == decision
print('Independent Python audit passed for 100 paired units, all endpoints and both 20000-resample intervals.')
