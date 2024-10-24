from os import walk, rename

mypath = "./images/gallery"
f = []
for (dirpath, dirnames, filenames) in walk(mypath):
    f.extend(filenames)
    break

for index, file in enumerate(filenames):
	print(file, str(index)+".jpg")
	rename(r"./images/gallery/"+file,r"./images/gallery/"+str(index)+".jpg")

print("done")