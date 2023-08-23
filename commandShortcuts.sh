#!/bin/bash

commitmsg=$1
buildandhost=$2

if [ -z "$commitmsg" ]; then
	echo "Provide a commit message."
	exit 1
elif [ "$buildandhost" == "prod" ]; then
	npm run build
	firebase deploy --only hosting
	git pull
	git add .
	git commit -m "$commitmsg"
	git push
elif [ "$commitmsg" == "ur" ]; then
	git pull
	git add .
	git commit -m "Updated README"
	git push
elif [ "$commitmsg" == "cc" ]; then
	git pull
	git add .
	git commit -m "Cleaned up some code"
	git push
elif [ "$commitmsg" == "bug" ]; then
	git pull
	git add .
	git commit -m "Fixed some bugs"
	git push
elif [ "$commitmsg" == "doc" ]; then
	git pull
	git add .
	git commit -m "Added and cleaned up some documentation"
	git push
elif [ "$commitmsg" == "help" ]; then
	echo ""
	echo ""
	echo "ALL COMMANDS"
	echo "  prod  runs build and hosting after push"
	echo "  ur    Update README"		
	echo "  cc    Clean up some code"
	echo "  bug   Fixed some bugs"
	echo "  doc   Added some documentation"
	echo ""
	echo ""
else
	git pull
	git add .
	git commit -m "$commitmsg"
	git push
fi
