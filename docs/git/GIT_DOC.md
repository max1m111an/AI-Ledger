# Git documentation
# PUSH
Before sending the changes, you need to create a commit with changed files.
For this, if you're in IDE (kind of JB), you can easily choose files to
commit in `Commit` (sidebar).

***IF*** new commit has changes on the previous, it'll be easier to `amend` it.

When all the commits are ready, goto Git Bash console and `git push --force-with-lease`.
> `--force-with-lease` is a safer option that will not overwrite 
> any work on the remote branch if more commits were added to the 
> remote branch.

***BUT*** to be completely calm to push your changes, please, 
`fetch` and `pull` changes from the branch.

---
# PULL
To pull the changes from the branch to your project, run `git pull --rebase`.


---
# GITHUB
1. ***Project & Issues***

...

2. ***Pull request***

...

---
# CONSOLE
I'm so *** lazy to write this, so I just pu it there [Cheat sheet on console commands](https://github.com/Oxana-S/Git-Help/blob/main/Шпаргалка%20по%20консольным%20командам%20Git.md) and this [Git origin docs](https://git-scm.com/docs)