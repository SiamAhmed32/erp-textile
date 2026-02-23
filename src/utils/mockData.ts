import { eachDayOfInterval, format, parseISO } from "date-fns";

export const generateMockAnalytics = (startDate: string, endDate: string, type: "buyer" | "order" | "user") => {
    const start = parseISO(startDate);
    const end = parseISO(endDate);

    // Safety check for invalid dates
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
        return [];
    }

    const days = eachDayOfInterval({ start, end });

    // Limit to last 30 days if range is too large to keep charts readable
    const displayDays = days.length > 31 ? days.slice(-31) : days;

    return displayDays.map(day => {
        const dateStr = format(day, "yyyy-MM-dd");
        let count = 0;

        // Generate pseudorandom data based on date and type
        const seed = day.getTime() + (type === "buyer" ? 1 : type === "order" ? 2 : 3);
        const random = (Math.sin(seed) + 1) / 2; // 0 to 1

        if (type === "buyer") {
            count = Math.floor(random * 50) + 10;
        } else if (type === "order") {
            count = Math.floor(random * 100) + 20;
        } else {
            count = Math.floor(random * 200) + 50;
        }

        return {
            date: dateStr,
            name: format(day, "MMM dd"),
            count: count
        };
    });
};
