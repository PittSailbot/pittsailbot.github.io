Documentation for our site is written using markdown and published through Github pages using mkdocs. If you're unfamiliar with using markdown, check out this handy [cheat sheet](https://www.markdownguide.org/cheat-sheet/).

In depth documentation for mkdocs can be found [here](https://www.mkdocs.org/user-guide/writing-your-docs/). 


### Install dependencies
1. In the terminal, install mkdocs and the mkdocs material theme with:
```console
pip install mkdocs
```
```console
pip install mkdocs-material
```

### Making changes
Our documentation is written in markdown and is organized into pages by `mkdocs.yml`. The main site is a combination of html and css.

- For editing any pre-existing .md files, changes will be updated automatically

- If you are adding any new files, then add the file under the `mkdocs.yml`'s nav config like so:
```
nav:
   - Getting Started: "Getting Started.md"
```

This will make the file "Getting Started.md" visible on the web page's index

### Previewing changes
To preview the documentation site before pushing changes to github:

1. In the terminal, run:
```console
mkdocs serve
```
2. In any web browser navigate to 127.0.0.1:8000