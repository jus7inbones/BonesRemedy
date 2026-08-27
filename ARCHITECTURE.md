# Architecture

Browser extension -> Meta Search landing page -> evidence adapter -> claim classifier -> review queue -> audit ledger.

Production next step:
- server-side signed identity registry
- source adapters
- evidence snapshots
- append-only audit storage
- authenticated report submission
- moderation and appeal workflow

Do not make a client-side 'immutable' shame database. True immutability belongs in a controlled audit system with append-only records, cryptographic hashes, access control, and an appeal/correction mechanism.
