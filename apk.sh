#!/bin/bash

echo "gen all apk ..."

echo " ====================================================================> generating ... ainicheng apk"
cd /data/app/ainicheng
cd ./android
./gradlew clean assembleRelease

echo " ====================================================================> generating ... dongmeiwei apk"
cd /data/app/dongmeiwei
yarn
sudo bash fix_npm.sh
cd ./android
./gradlew clean assembleRelease

echo " ====================================================================> generating ... dongdianyi apk"
cd /data/app/dongdianyi
yarn
sudo bash fix_npm.sh
cd ./android
./gradlew clean assembleRelease

echo " ====================================================================> generating ... dongdianyao apk"
cd /data/app/dongdianyao
yarn
sudo bash fix_npm.sh
cd ./android
./gradlew clean assembleRelease

echo " ====================================================================> generating ... qunyige apk"
cd /data/app/qunyige
yarn
sudo bash fix_npm.sh
cd ./android
./gradlew clean assembleRelease

echo " ====================================================================> generating ... dianmoge apk"
cd /data/app/dianmoge
yarn
sudo bash fix_npm.sh
cd ./android
./gradlew clean assembleRelease

echo " ====================================================================> generating ... youjianqi apk"
cd /data/app/youjianqi
yarn
sudo bash fix_npm.sh
cd ./android
./gradlew clean assembleRelease