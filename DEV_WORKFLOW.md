# Standard Workflow

## Feature flow
git checkout dev
git pull origin dev

# work

npm test -- --run
npm run build

git add .
git commit -m "..."
git push origin dev

## Promote to production
git checkout main
git pull origin main
git merge dev

npm test -- --run
npm run build

git push origin main

## Verify production
curl -s https://ordnung-ruhe-neu.vercel.app/ | grep -o 'index-[^"]*.js'

## Sync back
git checkout dev
git merge main
git push origin dev
