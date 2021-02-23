:: This is the windows version of a BASH script - a batch file.
:: This allows us to run multiple lines of commands in succession for windows command prompt, pretty much the exact same as a Unix's bash script.
:: Instead of the set -e in BASH, we have to actually use the pipes and goto :error for every line. This basically says if the command can't go through, it'll go straight to error instead, which is defined in our file at the end.
:: Make our deploy branch.
git checkout -b deploy || goto :error
:: The START allows us to use /wait, which is essentially the same as await in JS. It will make it so that the code will not continue until webpack finishes packing the bundle.js before moving on to add/commit them.
:: The problem is idk how to make this smoother because I haven't gone in depth into batch file writing. So this will open up a new command prompt window that will run the webpack command. When it finishes, you have to exit out of it yourself before this batch will continue executing its codes...and then you have to say you don't want to terminate the program, as well.
START /wait webpack -p || goto :error
:: Add the bundle.js/.map file. -f forces it to add because it's in .gitignore
git add -f public/bundle.js public/bundle.js.map || goto :error
:: Commit. --allow-empty lets us commit even if nothing is there.
git commit --allow-empty -m 'Deploying...' || goto :error
:: Push our deploy branch to heroku's master branch
git push --force heroku deploy:master || goto :error
:: This is the error case. If something goes wrong in any of the commands above, it will go to this line and run the code from here.
:: It essentially does the same thing that FullStack does in its deploy file. It will change you back to the master branch and destroy the deploy branch, then exit the batch script. This will also run at the end of every script to get rid of the deploy branch and change you back to master (as with in FullStack's script)
:error
echo Failed with error #%errorlevel%.
git checkout master
git branch -D deploy
exit /b %errorlevel%
