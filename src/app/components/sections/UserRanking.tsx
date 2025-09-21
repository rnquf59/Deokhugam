'use client';

interface UserRankingItem {
  id: string;
  rank: number;
  name: string;
  score: number;
}

interface UserRankingProps {
  users?: UserRankingItem[];
  hasPartialData?: boolean; 
  isEmpty?: boolean; 
}

export default function UserRanking({ users, hasPartialData = false, isEmpty = false }: UserRankingProps) {
  // 기본 데이터 (실제로는 props로 받아오거나 API에서 가져옴)
  const defaultUsers: UserRankingItem[] = [
    { id: '1', rank: 1, name: '김독서', score: 95 },
    { id: '2', rank: 2, name: '이리뷰', score: 92 },
    { id: '3', rank: 3, name: '박책사랑', score: 89 },
    { id: '4', rank: 4, name: '최독서왕', score: 87 },
    { id: '5', rank: 5, name: '정리뷰어', score: 85 },
    { id: '6', rank: 6, name: '한책마니아', score: 82 },
    { id: '7', rank: 7, name: '윤독서러', score: 80 },
    { id: '8', rank: 8, name: '강리뷰킹', score: 78 },
    { id: '9', rank: 9, name: '임책사랑', score: 75 },
    { id: '10', rank: 10, name: '조독서러', score: 73 },

  ];

  // 상태에 따라 다른 데이터 사용
  const getDisplayData = () => {
    if (isEmpty) {
      // 아예 순위가 없는 경우: 빈 데이터 10개
      return Array.from({ length: 10 }, (_, index) => ({
        id: `empty-${index + 1}`,
        rank: index + 1,
        name: '',
        score: 0
      }));
    } else if (hasPartialData) {
      // 일부만 순위가 있는 경우: 항상 10개 랭킹을 보여주되, 없는 부분은 빈 데이터로 채움
      const fullData = users || defaultUsers;
      const result = [];
      
      for (let i = 1; i <= 10; i++) {
        const existingUser = fullData.find(user => user.rank === i);
        if (existingUser) {
          result.push(existingUser);
        } else {
          result.push({
            id: `empty-${i}`,
            rank: i,
            name: '',
            score: 0
          });
        }
      }
      
      return result;
    } else {
      // 정상 데이터: 10개 모두 표시
      return users || defaultUsers;
    }
  };

  const userList = getDisplayData();

  const getRankStyle = (rank: number, isEmpty: boolean) => {
    if (isEmpty) {
      return {
        color: '#54545E',
        fontSize: '14px',
        fontWeight: '600',
        width: '22px',
        height: '22px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      };
    }
    
    if (rank <= 3) {
      const bgColors = {
        1: '#FFB310',
        2: '#9D9D9D', 
        3: '#846548'
      };
      
      return {
        backgroundColor: bgColors[rank as keyof typeof bgColors],
        color: '#FFFFFF',
        width: '22px',
        height: '22px',
        borderRadius: '50%',
        fontSize: '14px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      };
    } else {
      return {
        color: '#54545E',
        fontSize: '14px',
        fontWeight: '600',
        width: '22px',
        height: '22px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      };
    }
  };

  return (
    <div className="p-[30px] bg-gray-0 border-[1.5px] border-gray-200 rounded-[16px]">
      {/* 제목 */}
      <div className="mb-[16px]">
        <h3 className="text-body2 font-bold text-gray-800">
          유저들의 활동 순위
        </h3>
      </div>

      {/* 순위 리스트 */}
      <div className="flex flex-col gap-[12px]">
        {userList.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            {/* 왼쪽: 랭킹과 이름 */}
            <div className="flex items-center gap-[8px]">
              <span 
                className="text-body3 font-semibold"
                style={getRankStyle(user.rank, isEmpty)}
              >
                {isEmpty ? '-' : user.rank}
              </span>
              <span className="text-body2 font-semibold text-gray-900">
                {user.name || '--'}
              </span>
            </div>
            
            {/* 오른쪽: 점수 */}
            <span className={`${!user.name ? 'text-body4 font-medium text-gray-500' : 'text-body3 font-semibold text-gray-600'}`}>
              {user.name ? `${user.score}점` : '--'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
