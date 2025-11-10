// lay down traps for service calls
export const interceptServiceApisPingSession = <T extends object>(
    obj: T,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cb: () => Promise<any>,
): T => {
    return new Proxy(obj, {
        get(target, prop, receiver) {
            const value = Reflect.get(target, prop, receiver);

            if (typeof value === "function") {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return async (...args: any[]) => {
                    const res = await cb();

                    if (res instanceof Error) {
                        return;
                    }

                    return value.apply(target, args);
                };
            }

            return value;
        },
    });
};
