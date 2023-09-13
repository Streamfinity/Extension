#!/bin/sh

VERSION=$(echo $1|sed -r 's/-dev\.[0-9]+//')

echo "Version: $VERSION"

jq ".version = \"$VERSION\"" package.json > package.json.tmp
mv package.json.tmp package.json

# yarn version --new-version $VERSION --no-git-tag-version
