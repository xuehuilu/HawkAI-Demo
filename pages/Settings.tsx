import React from 'react';
import { PageHeader } from '../components/PageHeader';

export const Settings: React.FC = () => {
  return (
    <div>
      <PageHeader title="设置" subtitle="配置系统参数和个人偏好" />
      <div className="p-8">
        <div className="text-center py-20 bg-white rounded-lg border border-slate-200">
            <div className="text-6xl mb-4">⚙️</div>
            <h2 className="text-xl font-bold text-slate-700">设置功能开发中</h2>
            <p className="text-sm text-slate-500 mt-2">即将支持团队管理、权限配置、通知设置等功能。</p>
        </div>
      </div>
    </div>
  );
};
