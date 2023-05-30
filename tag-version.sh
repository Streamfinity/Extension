#!/bin/sh

VERSION=$(echo $1|sed 's/-dev\.[[:digit:]]$//')
yarn version --new-version $VERSION --no-git-tag-version
