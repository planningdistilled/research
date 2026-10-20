"""Portal adapters for tools/council_sweep.py (one module per portal product).

Each adapter module exposes:

    KIND = 'idox'                      # the `portal` value used in council-register.tsv

    def sweep(http, council, since, until) -> list[dict]
        Items decided (or meetings held) between the two dates. See common.Item fields.

    def fetch(http, council, item, outdir) -> list[dict]
        Download the officer report(s), notice and minutes for one item into outdir and
        return [{'file': <basename>, 'url': <source url>, 'kind': 'report'|'notice'|'minutes'|'update'|'other'}].
        Must not download the same URL twice (check outdir first) and must raise common.Blocked
        when the portal returns a Cloudflare / access-denied page.

Adapters use only the stdlib plus common.Http (which shells out to /usr/bin/curl). Keep traffic polite:
one request at a time, the delay from the register row, retries with back-off in Http.
"""
