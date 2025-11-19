@echo off
echo 🚀 Build project...
npm run build

echo 📂 Deploying to gh-pages branch...

git branch -D gh-pages 2>nul

git checkout --orphan gh-pages
git --work-tree build add --all
git --work-tree build commit -m "Deploy"

git push origin HEAD:gh-pages --force

git checkout -
