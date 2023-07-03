import type { FC, ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { Liff as LiffType } from '@line/liff/exports';

type Liff = LiffType | null;
type LiffError = string | null;

const LiffContext = createContext<{
  liff: Liff;
  error: LiffError;
}>({
  liff: null,
  error: null,
});

export const useLiff = () => useContext(LiffContext);

const LiffProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [liff, setLiff] = useState<Liff>(null);
  const [error, setError] = useState<LiffError>(null);

  useEffect(() => {
    import('@line/liff')
      .then((_liff) => _liff.default)
      .then((_liff) => {
        _liff
          .init({
            liffId: process.env.NEXT_PUBLIC_LIFF_ID as string,
            withLoginOnExternalBrowser: true,
          })
          .then(() => {
            setLiff(_liff);
          })
          .catch((_error: Error) => {
            setError(_error.toString());
          });
      });
  }, []);

  return (
    <LiffContext.Provider value={{ liff, error }}>
      {children}
    </LiffContext.Provider>
  );
};

export default LiffProvider;
