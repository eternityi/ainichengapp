#!/bin/bash

echo "拉取 ... ainicheng"
cd /data/app/ainicheng
git stash -u
git pull

echo "拉取 ... dongmeiwei"
cd /data/app/dongmeiwei
git stash -u
git pull

echo "拉取 ... dianmoge"
cd /data/app/dianmoge
git stash -u
git pull

echo "拉取 ... jucheshe"
cd /data/app/jucheshe
git stash -u
git pull

echo "拉取 ... youwangfa"
cd /data/app/youwangfa
git stash -u
git pull

echo "拉取 ... jinlinle"
cd /data/app/jinlinle
git stash -u
git pull
