import { Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyProps {
  /** 主提示文案 */
  title?: string;
  /** 补充说明 */
  description?: string;
  /** 自定义操作区（如「新增」按钮） */
  action?: React.ReactNode;
  className?: string;
}

export default function Empty({ title = '暂无数据', description, action, className }: EmptyProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center px-6 py-12 text-center', className)}>
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-sm border border-line bg-inset">
        <Inbox className="h-5 w-5 text-ink-3" />
      </div>
      <p className="text-[13px] font-medium text-ink-2">{title}</p>
      {description && <p className="mt-1 text-[12px] text-ink-3">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
