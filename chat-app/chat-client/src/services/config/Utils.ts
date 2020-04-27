export type KV = { [key: string]: any };

export const getDateTime = () => {
    return (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().slice(0, -1);
}

export const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString();
}

export const dateRangeSec = (date1Str: string, date2Str: string) => {
    const d1 = new Date(date1Str).getTime();
    const d2 = new Date(date2Str).getTime();
    return Math.floor((d2 - d1) / 1000);
}

function padLeft(n: number) {
    if (n <= 9) {
        return "0" + n;
    }
    return n
}