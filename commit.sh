#!/bin/bash

if [ z $1 ]; then
	echo "必须提供commit message ..."
	exit
fi

echo "提交 ainicheng"
cd /data/app/ainicheng
git add -A
git commit -m "$1"

echo "提交 dongmeiwei"
cd /data/app/dongmeiwei
git add -A
git commit -m "$1"

echo "提交 dianmoge"
cd /data/app/dianmoge
git add -A
git commit -m "$1"

echo "提交 jucheshe"
cd /data/app/jucheshe
git add -A
git commit -m "$1"

echo "提交 youwangfa"
cd /data/app/youwangfa
git add -A
git commit -m "$1"

echo "提交 jinlinle"
cd /data/app/jinlinle
git add -A
git commit -m "$1"