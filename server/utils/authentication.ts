import { JWT } from "../types/auth";
import { jwtDecode } from "jwt-decode";
export const validUserCheck = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: any,
  credential: string,
  userId: string
) => {
  let valid = false;
  try {
    const { email } = (await jwtDecode(credential)) as JWT;
    const { rows: users }: { rows: { [key: string]: string }[] } =
      await client.query(`SELECT user_id FROM users WHERE email = '${email}';`);
    valid = users.length > 0 && users[0].user_id === userId;
  } catch (error) {
    console.log(error);
  }
  return valid;
};
