import { LoginLogoutResponse, LoginParams, MockUser } from "@/features/auth/types/auth";
import { faker } from "@faker-js/faker";
import { fetchRequest } from "@/utils/fetchWrapper";

export const generateNewUser = (username: string) => ({
    id: faker.string.uuid(),
    name: username,
    picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${faker.string.uuid()}`,
});

const USER_DATA_STORAGE_KEY = "user_data";

export class AuthService {
    public async getCurrentUser(): Promise<MockUser | null> {
        return JSON.parse(
            localStorage.getItem(USER_DATA_STORAGE_KEY) ?? "null",
        ) as MockUser | null;
    }

    public async setUserData(user: MockUser): Promise<void> {
        localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(user));
    }

    public async login(params: LoginParams): Promise<MockUser | never> {
        return fetchRequest<LoginLogoutResponse>("/api/login", {
            method: "POST",
            body: JSON.stringify(params),
        }).then(() => {
            const user = generateNewUser(params.username);
            this.setUserData(user);
            return user as MockUser;
        });
    }

    public async logout(): Promise<void> {
        fetchRequest<LoginLogoutResponse>("/api/logout", {
            method: "POST",
        }).finally(() => {
            localStorage.clear();
        });
    }
}
