#!/bin/bash

cd /data/app/ainicheng
code-push release-react ainichengapk android
code-push release-react ainicheng ios

cd /data/app/dongmeiwei
code-push release-react dongmeiweiapk android
code-push release-react dongmeiwei ios

cd /data/app/dongdianyi
code-push release-react haxibiao/dongdianyiapk android
code-push release-react haxibiao/dongdianyi ios

cd /data/app/dongdianyao
code-push release-react dongdianyaoapk android
code-push release-react dongdianyao ios

cd /data/app/qunyige
code-push release-react haxibiao/qunyigeapk android
code-push release-react haxibiao/qunyige ios

cd /data/app/dianmoge
code-push release-react dianmogeapk android
code-push release-react dianmoge ios

cd /data/app/youjianqi
code-push release-react haxibiao/youjianqiapk android
code-push release-react haxibiao/youjianqi ios
