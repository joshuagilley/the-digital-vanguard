#!/bin/bash
echo 'run after_install.sh: ' >> /home/ec2-user/the-digital-vanguard/deploy.log

echo 'cd /home/ec2-user/the-digital-vanguard' >> /home/ec2-user/the-digital-vanguard/deploy.log
cd /home/ec2-user/the-digital-vanguard >> /home/ec2-user/the-digital-vanguard/deploy.log

echo 'npm install' >> /home/ec2-user/the-digital-vanguard/deploy.log 
npm install >> /home/ec2-user/the-digital-vanguard/deploy.log