#!bin/bash
red=$'\e[1;31m'
grn=$'\e[1;32m'
yel=$'\e[1;33m'
blu=$'\e[1;34m'
mag=$'\e[1;35m'
cyn=$'\e[1;36m'
end=$'\e[0m'

echo -e "${grn}dongmeiwei status ...${end}"
cd ../dongmeiwei
git config core.filemode false
git status

echo -e "${grn}dianmoge status ...${end}"
cd ../dianmoge
git config core.filemode false
git status

# echo -e "${grn}jucheshe status ...${end}"
# cd ../jucheshe
# git config core.filemode false
# git status

# echo -e "${grn}youwangfa status ...${end}"
# cd ../youwangfa
# git config core.filemode false
# git status

# echo -e "${grn}jinlinle status ...${end}"
# cd ../jinlinle
# git config core.filemode false
# git status
