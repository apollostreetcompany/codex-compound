.PHONY: install test release-validate validate bead-status bead-ready bootstrap-codex

install:
	bun install

test:
	bun test

release-validate:
	bun run release:validate

validate:
	bun test
	bun run release:validate

bead-status:
	bd status

bead-ready:
	bd ready

bootstrap-codex:
	./scripts/bootstrap-codex-compound.sh
