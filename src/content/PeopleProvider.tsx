import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Person } from '../../shared/content';
import { realPeople } from './index';
const PeopleContext = createContext<{ people: Person[]; isDemo: boolean; loading: boolean }>({
  people: realPeople,
  isDemo: false,
  loading: false
});
export function PeopleProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState({
    people: realPeople,
    isDemo: false,
    loading: import.meta.env.DEV && !realPeople.length
  });
  useEffect(() => {
    let active = true;
    if (import.meta.env.DEV && !realPeople.length) {
      import('../dev/mockPeople')
        .then(module => {
          if (active) setData({ people: module.makeMockPeople(), isDemo: true, loading: false });
        })
        .catch(error => {
          console.error('开发演示成员加载失败', error);
          if (active) setData({ people: [], isDemo: false, loading: false });
        });
    } else setData({ people: realPeople, isDemo: false, loading: false });
    return () => {
      active = false;
    };
  }, [realPeople]);
  return <PeopleContext.Provider value={data}>{children}</PeopleContext.Provider>;
}
export function usePeople() {
  return useContext(PeopleContext);
}
export function DemoPeopleNotice() {
  return (
    <div className="demo-people-notice">
      <span className="dev-dot" />
      开发演示数据 · 下方人物均为虚构，不代表真实成员或支持者。
    </div>
  );
}
