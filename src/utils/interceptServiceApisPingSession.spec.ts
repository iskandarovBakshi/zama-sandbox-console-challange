import { expect, describe, it } from "vitest";
import { interceptServiceApisPingSession } from "@/utils/interceptServiceApisPingSession";

describe("[001] Test interceptServiceApisPingSession function", () => {
    it("should intercept method calls and still return original result", async () => {
        class Human {
            walk() {
                return true;
            }
        }

        const bakshi = new Human();
        let intercepted = false;

        const interceptedHuman = interceptServiceApisPingSession(bakshi, async () => {
            intercepted = true;
        });

        const result = await interceptedHuman.walk();

        expect(result).toBe(true);
        expect(intercepted).toBe(true);
    });
});
