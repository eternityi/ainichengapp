#!/bin/bash

echo "gen all apk ..."

# echo " ====================================================================> generating ... ainicheng apk"
# cd /data/app/ainicheng/android
# ./gradlew assembleRelease

echo " ====================================================================> generating ... dongmeiwei apk"
cd /data/app/dongmeiwei/android
yarn
./gradlew assembleRelease

echo " ====================================================================> generating ... dongdianyi apk"
cd /data/app/dongdianyi/android
yarn
./gradlew assembleRelease

echo " ====================================================================> generating ... dongdianyao apk"
cd /data/app/dongdianyao/android
yarn
./gradlew assembleRelease

echo " ====================================================================> generating ... qunyige apk"
cd /data/app/qunyige/android
yarn
./gradlew assembleRelease

echo " ====================================================================> generating ... dianmoge apk"
cd /data/app/dianmoge/android
yarn
./gradlew assembleRelease

echo " ====================================================================> generating ... youjianqi apk"
cd /data/app/youjianqi/android
yarn
./gradlew assembleRelease