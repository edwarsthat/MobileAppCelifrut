import { ZodError } from "zod";

export function getErrorMessages(zodError: ZodError): Record<string, string> {
    return zodError.issues.reduce((acc: Record<string, string>, issue) => {
        const path = issue.path[0]?.toString() ?? "general";
        acc[path] = issue.message;
        return acc;
    }, {});
}
