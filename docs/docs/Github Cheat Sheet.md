# Splitting up a commit in a branch
Use case: You combined unrelated changes into the same commit and want to split them for readability or reducing diffs

1. Checkout the branch that you want to modify (e.g. pj/feature)
2. Start an interactive rebase which includes your commit.
- At a minimum, git rebase -i commit^ will start the rebase at the commit you want to split
- You can also rebase the whole branch, which I usually do to split all target commits in one go
3. Mark the commit(s) that you want to split with edit
4. When git presents the commit that you want to split:
    1. Reset state to the previous commit using git reset HEAD^
    2. Use git add to carefully and incrementally add changes to the index
    3. Run git commit when you have a set of atomic changes that you are ready to commit
    4. Repeat the git add and git commit process until you have processed each set of changes represented by the commit
5. Run git rebase --continue to resume or finish the rebase