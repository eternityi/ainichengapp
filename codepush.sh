#!/bin/bash

cd /data/app/ainicheng
code-push release-react ainichengapk android
code-push release-react ainicheng ios

cd /data/app/dongmeiwei
code-push release-react dongmeiweiapk android
code-push release-react dongmeiwei ios --plistFile=ios/dongmeiwei/Info.plist

cd /data/app/dongdianyi
code-push release-react haxibiao/dongdianyiapk android
code-push release-react haxibiao/dongdianyi ios --plistFile=ios/dongdianyi/Info.plist

cd /data/app/dongdianyao
code-push release-react dongdianyaoapk android
code-push release-react dongdianyao ios --plistFile=ios/dongdianyao/Info.plist

cd /data/app/qunyige
code-push release-react haxibiao/qunyigeapk android
code-push release-react haxibiao/qunyige ios --plistFile=ios/qunyige/Info.plist

cd /data/app/dianmoge
code-push release-react dianmogeapk android
code-push release-react dianmoge ios --plistFile=ios/dianmoge/Info.plist

cd /data/app/youjianqi
code-push release-react haxibiao/youjianqiapk android
code-push release-react haxibiao/youjianqi ios --plistFile=ios/youjianqi/Info.plist
