#!/bin/bash
red=$'\e[1;31m'
grn=$'\e[1;32m'
yel=$'\e[1;33m'
blu=$'\e[1;34m'
mag=$'\e[1;35m'
cyn=$'\e[1;36m'
end=$'\e[0m'

function genapk() {
	echo -e "\n${blu}====================================================================> generating ... $1 apk ${end}"
	cd /data/app/$1
	yarn
	sudo bash fix_npm.sh
	react-native-asset
	react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle 
	# --assets-dest android/app/src/main/res
	cd ./android
	./gradlew clean assemble
}


if [ ! -z $1 ]; then
	genapk $1
else
	echo "gen all apks ..."
	genapk "ainicheng"
	genapk "dongmeiwei"
	genapk "dongdianyi"
	genapk "dongdianyao"
	genapk "qunyige"
	genapk "dianmoge"
	genapk "youjianqi"
fi