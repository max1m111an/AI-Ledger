export function getToday(date = new Date()): string {
    const formatter = new Intl.DateTimeFormat("ru-RU", {
        day: "numeric",
        month: "long",
    });

    return formatter.format(date);
}
