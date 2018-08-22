
from='ainicheng';
to=$1
if [ -z $1 ]; then
	echo "please input to app alias ..."
	exit
fi

echo "copy code to $to ..."
cd /data/app/$from

/bin/cp -rf ./android/gradle.properties ../$to/android
/bin/cp -rf ./android/app/build.gradle ../$to/android/app
/bin/cp -rf ./android/app/versionCode.gradle ../$to/android/app

/bin/cp -rf ./package.json ../$to/
/bin/cp -rf ./appVersion.json ../$to/
/bin/cp -rf ./App.js ../$to/
/bin/cp -rf ./ApolloApp.js ../$to/

/bin/cp -rf ./constants/Config.js ../$to/constants
/bin/cp -rf ./constants/Layout.js ../$to/constants
/bin/cp -rf ./constants/Methods.js ../$to/constants

/bin/cp -rf ./assets ../$to/
/bin/cp -rf ./components ../$to/
/bin/cp -rf ./graphql ../$to/
/bin/cp -rf ./navigation ../$to/
/bin/cp -rf ./screens ../$to/
/bin/cp -rf ./store ../$to/
/bin/cp -rf ./utils ../$to/

echo "done"