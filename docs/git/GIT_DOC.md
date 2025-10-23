# Git documentation
<u>| Sidebar icons will tag by _italics_. |</u>
# UPDATE
1. ***Fetch***

To update branches and commits from **Remote**, run `Fetch` in _Git_.

2. ***Pull***

To pull the changes from the branch to your project, run `git pull --rebase`.

To merge the changes from the main branch to your branch, execute `git merge origin/main`

---
# PUSH
Before sending the changes, you need to create a commit with changed files.
For this, if you're in IDE (kind of JB), you can easily choose files to
commit in _Commit_.

***IF*** new commit has changes on the previous, it'll be easier to `amend` it.

When all the commits are ready, goto **Git Bash** console and `git push --force-with-lease`.
(or you can push directly via IDE, but JB is idiots and gone from Ru, son good luck with it)
> `--force-with-lease` is a safer option that will not overwrite
> any work on the remote branch if more commits were added to the
> remote branch.

***BUT*** to be completely calm to push your changes, please,
`fetch` and `pull` changes from the branch.

---
# GITHUB
1. ***Project & Issues***

We have kanban desk in project **ledger**, so you're able to add tasks,
move it to any states and manage deadlines.
To add task, click on **Add item** down below any column. Then, choose name,
that describe what you want to do. Make sure, that it belongs to project **AI-Ledger**!
After that, write description to task in RU using **md**, and put it to project desk.

Also, you can choose the task _Priority_ and _Size_, and even _Timelines_.
It helps to sort tasks by these params.

Don't actually forget to _Assign_ users, who working with this task.

If you make sure, you've done all steps correctly, you can now switch in _Development_
and create branch for this task. There are a few rules to this:
- When you choose the name of a task, remove its id and put here string like **/config**,
so git able to mkdir and structure branches.
- Set the command, that you gain from **GitHub** to **GitBash** console in IDE.

Now you can clearly work with this task on its branch with no problems.
> The whole process can be described as follows:
> 1. We create task, configure it, and create branch for it.
> 2. While working on branch, we gradually update it if updates occur on
> the primary branch (`main`).
> 3. After finishing the work, we create a **Pull request**, wait for its
> confirmation, fix what is required and merge it into the primary branch (`main`).

2. ***Pull request***

When the work has done, or it has to be reviewed by someone, you can make **Pull request**.

It's go on **GitHub**, on the branch you want, and which is updated.
Fill the main fields on **Pull request** (don't forget to _Assign_ yourself and
other users), and choose the users you want to review this.

After that, wait for review and clearly keep working, all commits will directly
come to PR.

When the PR is approved and you sure that all the work has done -
`Merge` it to primary branch (`main`).

Now, notify your team about that, so they can pull update from main to their branches.

---
# CONSOLE
I'm so *** lazy to write this, so I just put it there [Cheat sheet on console commands](https://github.com/Oxana-S/Git-Help/blob/main/Шпаргалка%20по%20консольным%20командам%20Git.md) and [Git origin docs](https://git-scm.com/docs)