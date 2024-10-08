export const HEADERS = ['firstName', 'lastName', 'asset', 'createdOn'];

export const TITLE = 'Import steps';

export const STEPS = [
	'Download our csv templates and add all of your lot information.',
	"Upload the csv file containing your lot's information.",
	'Drag and drop the uploaded groupings to match our groupings.',
];

export const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://google.ca';