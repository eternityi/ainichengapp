
from='ainicheng';
to=$1
if [ -z $1 ]; then
	echo "please input to app alias ..."
	exit
fi

echo "copy code to $to ..."

codepush_key_ios_staging_ainicheng="IjREDjPhKQkO-huamZmkWBLbUIQsHk6TKykDQ"
codepush_key_ios_production_ainicheng="6TlnI4CIOr4SyIEVinY3DmQCwTM7r1C6tJJPX"
codepush_key_ios_staging_to=""
codepush_key_ios_production_to=""
appname_from="爱你城"
appname_to=""
if [ $to == "dongmeiwei" ];then
	appname_to="懂美味"
	codepush_key_ios_staging_to="HML1mcz9y_0Y4lfhf0Mvs2NLqt_LHk1JTlgv7"
	codepush_key_ios_production_to="KDIQ0WXJv6SKLUImD7WHnfyWueH_HJkJaxlDQ"
fi
if [ $to == "dongdianyi" ];then
	appname_to="懂点医"
	codepush_key_ios_staging_to="AX5KNp_FU0Awnjp-PH-MCU0NdDDJr1nvm7WUm"
	codepush_key_ios_production_to="_hE50czn_LOfdv4KM2CToaYA9VCiSJnP7Qb8Q"
fi
if [ $to == "dongdianyao" ];then
	appname_to="懂点药"
	codepush_key_ios_staging_to="ur8jZo_2eKRqgPQC_7V2uBqFN0bRH1WlUR0Lm"
	codepush_key_ios_production_to="4qYy4S0Vw99TnON5usk-83MbJUeVByZeLCC87"
fi
if [ $to == "qunyige" ];then
	appname_to="群衣閣"
	codepush_key_ios_staging_to="B1DT-DsFuU6w7ORV90FHO9zvh8RQB1bFnJwZIm"
	codepush_key_ios_production_to="dEfiFnmoKnUtiz9gZtnK6uxE00ocryKn1vWIm"
fi
if [ $to == "dianmoge" ];then
	appname_to="点墨閣"
	codepush_key_ios_staging_to="6qOZAr2eQwJCEralSuXYmiCMOUq_H1VZ9AC87"
	codepush_key_ios_production_to="xs3gu3n8KzX5Z502CLIlzCsrTyDYB14bq0C87"
fi
if [ $to == "youjianqi" ];then
	appname_to="有剑气"
	codepush_key_ios_staging_to="wAeIso_xMmUw20vg2x9lCnalgzPHHkun8DZU7"
	codepush_key_ios_production_to="8gK428EzV6D-c31DHQXMnaweErFcry_3Uv-UX"
fi

red=$'\e[1;31m'
grn=$'\e[1;32m'
yel=$'\e[1;33m'
blu=$'\e[1;34m'
mag=$'\e[1;35m'
cyn=$'\e[1;36m'
end=$'\e[0m'

if [ -z $appname_to ]; then
	echo -e "${red}复制到得项目名无效${end}，没设置正确的name 和 codepush keys ..."
	exit
fi

cd /data/app/$from

/bin/cp -rf ./package.json ../$to/
/bin/cp -rf ./appVersion.json ../$to/
/bin/cp -rf ./App.js ../$to/
/bin/cp -rf ./ApolloApp.js ../$to/

/bin/cp -rf ./constants/Config.js ../$to/constants
/bin/cp -rf ./constants/index.js ../$to/constants
/bin/cp -rf ./constants/Methods.js ../$to/constants
/bin/cp -rf ./constants/Divice.js ../$to/constants

/bin/cp -rf ./assets ../$to/
/bin/cp -rf ./components ../$to/
/bin/cp -rf ./graphql ../$to/
/bin/cp -rf ./navigation ../$to/
/bin/cp -rf ./screens ../$to/
/bin/cp -rf ./store ../$to/
/bin/cp -rf ./utils ../$to/

echo " == fix native projects ..."
/bin/cp -rf ./fix_npm.sh ../$to/

echo "  - fix android ..."
/bin/cp -rf ./android/settings.gradle ../$to/android
/bin/cp -rf ./android/gradle.properties ../$to/android
/bin/cp -rf ./android/app/build.gradle ../$to/android/app
/bin/cp -rf ./android/app/versionCode.gradle ../$to/android/app
/bin/cp -rf ./android/app/src/main/java/com/$from/MainApplication.java ../$to/android/app/src/main/java/com/$to/
sed -i -e "s/$from/$to/g" "../$to/android/app/src/main/java/com/$to/MainApplication.java"

echo "  - fix ios ..."
/bin/cp -rf ./ios/$from/Info.plist ../$to/ios/$to/
sed -i -e "s/$from/$to/g" "../$to/ios/$to/Info.plist"
sed -i -e "s/$appname_from/$appname_to/g" "../$to/ios/$to/Info.plist"

/bin/cp -rf ./ios/$from.xcodeproj/project.pbxproj ../$to/ios/$to.xcodeproj/project.pbxproj
sed -i -e "s/$from/$to/g" "../$to/ios/$to.xcodeproj/project.pbxproj"
echo " ... replacing codepush keys ..."
sed -i -e "s/$codepush_key_ios_staging_ainicheng/$codepush_key_ios_staging_to/g" "../$to/ios/$to.xcodeproj/project.pbxproj"
sed -i -e "s/$codepush_key_ios_production_ainicheng/$codepush_key_ios_production_to/g" "../$to/ios/$to.xcodeproj/project.pbxproj"

echo "done"
