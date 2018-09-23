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

# echo -e "${grn}dongdianyao status ...${end}"
# cd ../dongdianyao
# git config core.filemode false
# git status

# echo -e "${grn}dongdianyi status ...${end}"
# cd ../dongdianyi
# git config core.filemode false
# git status

# echo -e "${grn}qunyige status ...${end}"
# cd ../qunyige
# git config core.filemode false
# git status

# echo -e "${grn}youjianqi status ...${end}"
# cd ../youjianqi
# git config core.filemode false
# git status

echo -e "${grn}dianmoge status ...${end}"
cd ../dianmoge
git config core.filemode false
git status