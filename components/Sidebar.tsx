import React from 'react';
import { NAV_ITEMS } from '../constants';
import { Page } from '../types';

interface SidebarProps {
  activePage: Page;
  navigateTo: (page: Page) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, navigateTo }) => {
  return (
    <div className="w-64 bg-slate-800 text-white flex flex-col shadow-lg">
      <div className="p-5 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="text-3xl">🦅</div>
          <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
            HawkAI
          </div>
        </div>
        <div className="text-xs text-slate-400 pl-11">一体化非功能测试平台</div>
      </div>

      <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
        {NAV_ITEMS.map((section) => (
          <div key={section.id}>
            <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.id}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo(item.id as Page);
                    }}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                      activePage === item.id
                        ? 'bg-indigo-500/20 text-white border-l-4 border-indigo-400'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <span className="w-5 text-center">{item.icon}</span>
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto bg-indigo-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold">
            张
          </div>
          <div>
            <div className="font-semibold text-sm">张三</div>
            <div className="text-xs text-slate-400">技术负责人</div>
          </div>
        </div>
      </div>
    </div>
  );
};