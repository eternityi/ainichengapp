#!/bin/bash

echo "gen all apk ..."

echo "generating ... ainicheng apk"
cd /data/app/ainicheng/android
./gradlew assembleRelease

echo "generating ... dongmeiwei apk"
cd /data/app/dongmeiwei/android
./gradlew assembleRelease

echo "generating ... dongdianyi apk"
cd /data/app/dongdianyi/android
./gradlew assembleRelease

echo "generating ... dongdianyao apk"
cd /data/app/dongdianyao/android
./gradlew assembleRelease

echo "generating ... qunyige apk"
cd /data/app/qunyige/android
./gradlew assembleRelease

echo "generating ... dianmoge apk"
cd /data/app/dianmoge/android
./gradlew assembleRelease

echo "generating ... youjianqi apk"
cd /data/app/youjianqi/android
./gradlew assembleRelease