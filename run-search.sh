#!/bin/bash

echo "Running smart search..."
node smart-search.js

if [ $? -eq 0 ]; then
  echo "Search completed successfully!"
else
  echo "Search did not find a match, trying comprehensive patterns..."
fi
