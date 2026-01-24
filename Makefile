SERVER_HOST ?= mtv
SERVER_PATH ?= /home/strider/shatbot-discord

deploy:
	rsync -avz --delete --exclude node_modules --exclude '*.db' --exclude conf.json --exclude auth.json --exclude .git . $(SERVER_HOST):$(SERVER_PATH)/
	ssh $(SERVER_HOST) "cd $(SERVER_PATH) && npm install --omit=dev"
	ssh $(SERVER_HOST) "sudo systemctl restart shatbot"
