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
		
	if [ -z $2 ]; then
		push_ios $app
		push_android $app
	fi
	echo $2
	if [ "$2" == "android" ]; then
		push_android $app
	fi

	if [ "$2" == "ios" ]; then
		push_ios $app
	fi 
	
	echo -e "${grn}完成热更新 ${app}...${end}"
}

function push_android(){
	app=$1
	echo -e "${blu}android 热更新 ${app}...${end}"
	code-push release-react haxibiao/${app}apk android
}

function push_ios(){
	app=$1
	echo -e "${blu}ios 热更新 ${app}...${end}"
	code-push release-react haxibiao/$app ios --plistFile=ios/$app/Info.plist
}

if [ -z $1 ]; then
	echo "开始热更新全部app,需要单个更新，请传入一个appname"
	codepush "ainicheng"
	codepush "dongmeiwei"
	codepush "dianmoge"
	codepush "jucheshe"
	codepush "youwangfa"
	codepush "jinlinle"
else
	codepush $1 $2
fi