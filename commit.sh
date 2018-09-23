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

# echo "提交 dongdianyi"
# cd /data/app/dongdianyi
# git add -A
# git commit -m "$1"

# echo "提交 dongdianyao"
# cd /data/app/dongdianyao
# git add -A
# git commit -m "$1"

# echo "提交 qunyige"
# cd /data/app/qunyige
# git add -A
# git commit -m "$1"

echo "提交 dianmoge"
cd /data/app/dianmoge
git add -A
git commit -m "$1"

# echo "提交 youjianqi"
# cd /data/app/youjianqi
# git add -A
# git commit -m "$1"