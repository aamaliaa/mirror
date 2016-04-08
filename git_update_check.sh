#!/bin/bash
# git_update_check.sh
#
# Checks git remote for updates. If there are updates, it pulls, installs
# dependencies, rebuilds, and restarts app. To be run via cron periodically.
#
# Add the following to your crontab to run every 15 min:
# */15 * * * * ~/mirror/git_update_check.sh
#
# Requirements: forever (https://github.com/foreverjs/forever)

cd ~/mirror
git fetch origin
reslog=$(git log HEAD..origin/master --oneline)

if [[ "${reslog}" != "" ]] ; then
  echo "Pulling..."
  git pull origin master
  echo "Updating dependencies..."
  npm install
  echo "Building app..."
  npm run build
  echo "Restarting app..."
  /usr/local/bin/forever restart ~/mirror/app.js
else
  echo "Up-to-date."
fi
