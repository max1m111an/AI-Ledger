# Update dependencies on local project

When new dependencies were load to pyproject.toml, you have to upload them in your local project.

To do this, there are only 5 simple steps:
1. Check, that your project is actually load `.venv` (this prefix was in the terminal)
2. `pip install poetry` - this command load poetry, dependencies manager;
3. `poetry install` - this command use poetry to load all it dependencies;
4. `poetry export --without-hashes -o requirements.txt` - clearly updated requirements file;
5. `pip install -r requirements.txt` - to finally install all dependencies into project.

Now, you can work with no error like ModuleError, but whatever happens, you can message me for any trouble :)