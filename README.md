# CSV Upload Tool

This project aims to be a React component integrable into any site allowing users to upload CSV data and match their CSV files headers (i.e., the values in the first row) to pre-assigned JSON headers. It's built using React and Bootstrap for the frontend, and Flask for the backend. Eventually, the JSON data will be written to an SQLite database.

## Get it running on your machine

### Initial configuration

1. First, clone the repository to your computer
2. Navigate to `react-frontend` and run `npm -i` and `npm run build`. This will build the current version of the project to the folder Flask will eventually serve
3. `cd ..` and then move into the `flask-backend` directory. Install Flask if you haven't already using pip, and then begin the server by running `python main.py` (however, you will probably have to take all of the steps below to *actually* get things working)

### Start a virtual environment

You will likely to install the various Python dependencies needed by the project. To do so, it is recommended you create a virtual environment.

#### Windows

1. Navigate to to the `flask-backend` folder in your terminal
2. Execute `python -m venv env`. Check the `/env` folder has been created and that it is being ignored
3. Begin the virtual environment by running `env\Scripts\activate.bat` - you may check it's running by executing `where python`
4. Run `pip install -r requirements.txt` to install all dependecies
5. If you make any changes to the requirements, run `pip freeze > requirements.txt` to save then

#### Linux or Mac

TBD

### Begin a local instance of the server

1. Navigate to to the `flask-backend` folder in your terminal
2. Type `python` to open a Python terminal
3. First execute `from main import db`
4. Then, to actually create the tables needed, run `db.create_all()`
5. If you have an old version of the database, just delete the file, or write `db.drop_all()`

## Use cases

This tool is being developed for [Artesian Software](https://artesiansoft.com/), a Industrial IoT solution provider based in Alberta. The tool will allow farmers to upload their sensor data to Artensian's servers with an easy to use interface.

## Contributing

TBD