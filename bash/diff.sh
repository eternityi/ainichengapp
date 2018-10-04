#!bin/bash
red=$'\e[1;31m'
grn=$'\e[1;32m'
yel=$'\e[1;33m'
blu=$'\e[1;34m'
mag=$'\e[1;35m'
cyn=$'\e[1;36m'
end=$'\e[0m'

echo -e "${grn}dongmeiwei diff . ...${end}"
cd ../dongmeiwei
git diff .

echo -e "${grn}dongdianyao diff . ...${end}"
cd ../dongdianyao
git diff .

echo -e "${grn}dongdianyi diff . ...${end}"
cd ../dongdianyi
git diff .

echo -e "${grn}qunyige diff . ...${end}"
cd ../qunyige
git diff .

echo -e "${grn}youjianqi diff . ...${end}"
cd ../youjianqi
git diff .

echo -e "${grn}dianmoge diff . ...${end}"
cd ../dianmoge
git diff .