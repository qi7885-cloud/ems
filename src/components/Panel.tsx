import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PanelProps {
  title?: string;
  description?: string;
  /** 标题栏右侧内容（单位说明、图例、按钮） */
  aside?: ReactNode;
  /** 标题栏下方、内容上方的工具条 */
  toolbar?: ReactNode;
  children?: ReactNode;
  className?: string;
  bodyClassName?: string;
  /** 内容区不加内边距（表格、图表、列表常用） */
  flush?: boolean;
}

/**
 * 统一的面板容器：带 1px 边框、方角、标题栏左侧青色标识条。
 * 页面里不要再手写 `bg-panel border border-line rounded` 这类组合。
 */
export default function Panel({
  title,
  description,
  aside,
  toolbar,
  children,
  className,
  bodyClassName,
  flush,
}: PanelProps) {
  return (
    <section className={cn('panel flex flex-col', className)}>
      {(title || aside) && (
        <div className="panel-head">
          <div className="min-w-0">
            <h2 className="panel-title">{title}</h2>
            {description && <p className="mt-1 text-[11px] text-ink-3">{description}</p>}
          </div>
          {aside && <div className="flex shrink-0 items-center gap-2 text-[11px] text-ink-3">{aside}</div>}
        </div>
      )}
      {toolbar && <div className="border-b border-line bg-inset px-3 py-2">{toolbar}</div>}
      <div className={cn('flex-1', flush ? '' : 'p-3', bodyClassName)}>{children}</div>
    </section>
  );
}
