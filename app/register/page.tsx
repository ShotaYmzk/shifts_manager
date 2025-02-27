//app/register/page.tsx
'use client';
import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase/client';
import Link from 'next/link';
import styles from '../../styles/Register.module.css'; // CSS モジュールのインポート

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      alert("メールアドレスを入力してください");
      return;
    }

    console.log(router)
  
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      console.log(data, error);
  
      if (error) {
        console.error("Auth error:", error.message);
        alert(`エラー: ${error.message}`);
        return;
      }
  
      alert("登録完了！メールを確認してください");
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("予期しないエラーが発生しました");
    }
  };

  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>新規登録画面</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.main}>
          <div className={styles.grid}>
            <form onSubmit={onSubmit}>
              <div>
                <label>メールアドレス</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={styles.input}
                />
              </div>
              <div>
                <label>パスワード</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={styles.input}
                />
              </div>
              <div>
                <label>パスワード（確認）</label>
                <input
                  type="password"
                  required
                  value={passwordConf}
                  onChange={e => setPasswordConf(e.target.value)}
                  className={styles.input}
                />
              </div>
              <div>
                <button type="submit" className={styles.button}>サインアップ</button>
              </div>
            </form>
          </div>
        </main>
        <footer className={styles.footer}>
          <Link href="/login">ログインはこちら</Link>
        </footer>
      </div>
    </>
  );
}