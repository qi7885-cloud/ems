import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  /** 右侧操作区：筛选器、按钮等 */
  children?: ReactNode;
}

/**
 * 统一的页面头部。所有业务页都用它，
 * 保证「标题 / 说明 / 操作区」三件套的位置与字号在全站一致。
 */
export default function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="page-head">
      <div className="min-w-0">
        <h1 className="page-title">{title}</h1>
        {description && <p className="page-desc">{description}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}
