#!/bin/bash

function genapk() {
	echo " ====================================================================> generating ... $1 apk"
	cd /data/app/$1
	yarn
	sudo bash fix_npm.sh
	react-native-asset
	cd ./android
	./gradlew clean assembleRelease
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