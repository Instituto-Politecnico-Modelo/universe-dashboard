import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcrypt-ts';

import { authConfig } from '@/app/auth.config';
import { getUserAction } from '@/actions/userActions';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize({ email, password }: any) {
        let user = await getUserAction(email);

        if (user == null) {
          return null;
        }
    

        let passwordsMatch = await compare(password, user.password);
        if (passwordsMatch) {
          return user as any;
        }
        console.log(6);
        
      },
    }),
  ],
});
