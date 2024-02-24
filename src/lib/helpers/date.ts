import { format as tempoFormat } from '@formkit/tempo';
export const getTimestamp = (dateValue: Date): number => {
	return dateValue.getTime();
};

const listFormats = {
	ddMMyyyy: 'DD/MM/YYYY',
	ddMMyyyyHHmm: 'DD/MM/YYYY HH:mm',
	ddMMyyyyHHmmss: 'DD/MM/YYYY HH:mm:ss',
	yyyyMMdd: 'YYYY-MM-DD',
	yyyyMMddHHmm: 'YYYY-MM-DD HH:mm',
	yyyyMMddHHmmss: 'YYYY-MM-DD HH:mm:ss',
	'short-date': 'DD/MM/YYYY',
	'long-date': 'DD MMMM YYYY',
	'short-time': 'HH:mm',
	'long-time': 'HH:mm:ss',
	iso: 'YYYY-MM-DDTHH:mm:ssZ',
	'short-datetime': 'DD/MM/YYYY HH:mm',
	'long-datetime': 'DD MMMM YYYY HH:mm:ss'
} as const;
type Format = keyof typeof listFormats;

export const format = (dateValue: Date, format: Format): string => {
	return tempoFormat(dateValue, format);
};
