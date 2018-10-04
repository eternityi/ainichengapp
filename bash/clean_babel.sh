#!/bin/bash

bash ./bash/fix_npm.sh 

echo "清理 babel cache ..."
rimraf ./node_modules/.cache/babel-loader