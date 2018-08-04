
from='ainicheng';
to=$1
if [ -z $1 ]; then
	echo "please input to app alias ..."
	exit
fi

echo "copy code to $to ..."
cd /data/app/$from
/bin/cp -rf ./assets ../$to/
/bin/cp -rf ./components ../$to/
/bin/cp -rf ./graphql ../$to/
/bin/cp -rf ./navigation ../$to/
/bin/cp -rf ./screens ../$to/
/bin/cp -rf ./store ../$to/
/bin/cp -rf ./utils ../$to/

echo "done"