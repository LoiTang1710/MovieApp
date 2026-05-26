import { useQuery } from '@tanstack/react-query';
import { fetchAdminOverview } from '../apis/admin.api';

export const useAdminOverview = () => {
  return useQuery({
    queryKey: ['adminOverview'],
    queryFn: fetchAdminOverview,
    // Dữ liệu dashboard không cần cập nhật quá thường xuyên, ta có thể set staleTime
    staleTime: 1000 * 60 * 5, // 5 phút
  });
};