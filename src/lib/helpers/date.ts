import type { DateValue } from '@internationalized/date';

export const timeStamp = (dateValue: DateValue | Date): number => {
	if (dateValue instanceof Date) {
		return dateValue.getTime();
	}

	return dateValue.toDate('UTC').getTime();
};
