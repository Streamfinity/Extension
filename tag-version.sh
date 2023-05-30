#!/bin/sh

VERSION=$(echo $1|sed -r 's/-dev\.[0-9]+//')
yarn version --new-version $VERSION --no-git-tag-version
