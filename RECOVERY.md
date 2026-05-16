# Recovery

## Abort merge
git merge --abort

## Discard local changes
git restore .

## Remove untracked files
git clean -fd

## Reset to remote
git fetch origin
git reset --hard origin/dev

## Check repo state
git status
git branch --show-current
git rev-parse --short HEAD
