let begin = "sudo bash /home/pi/server/ygopro-server/";
module.exports = {
 updateScript:begin+"update.sh",
 updateYgoPro:begin+"updateYgopro.sh",
 updateWindbot:begin+"updateWindbot.sh",
 restartServer:"sudo pm2 restart all",
 restartPi:"sudo reboot",
 updateBot:"cd /home/pi/server/PiBot && git reset --hard && git pull && npm install -y && sudo chmod -R 777 * && sudo pm2 restart mybot"
}
