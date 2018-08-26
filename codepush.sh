#!/bin/bash
red=$'\e[1;31m'
grn=$'\e[1;32m'
yel=$'\e[1;33m'
blu=$'\e[1;34m'
mag=$'\e[1;35m'
cyn=$'\e[1;36m'
end=$'\e[0m'

function codepush(){
	app=$1
	echo -e "\n${yel}开始热更新 ${app}...${end}"
	cd /data/app/$app
	echo -e "${blu}android 热更新 ${app}...${end}"
	code-push release-react haxibiao/${app}apk android
	echo -e "${blu}ios 热更新 ${app}...${end}"
	code-push release-react haxibiao/$app ios --plistFile=ios/$app/Info.plist
	echo -e "${grn}完成热更新 ${app}...${end}"
}

if [ -z $1 ]; then
	echo "开始热更新全部app,需要单个更新，请传入一个appname"
	codepush "ainicheng"
	codepush "dongmeiwei"
	codepush "dongdianyi"
	codepush "dongdianyao"
	codepush "qunyige"
	codepush "dianmoge"
	codepush "youjianqi"
else
	codepush $1
fi