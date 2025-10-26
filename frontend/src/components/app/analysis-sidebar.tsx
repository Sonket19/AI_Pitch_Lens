'use client';

import { cn } from '@/lib/utils';
import { Logo } from '@/components/app/logo';
import { Separator } from '@/components/ui/separator';
import { LayoutDashboard, ShieldAlert, Factory, Banknote, MessageSquare, Bot } from 'lucide-react';

interface AnalysisSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { name: 'Executive Summary', icon: LayoutDashboard },
  { name: 'Risk Assessment', icon: ShieldAlert },
  { name: 'Industry Analysis', icon: Factory },
  { name: 'Financials', icon: Banknote },
  { name: 'Founder Connect & Q&A', icon: MessageSquare },
  { name: 'AI Chatbot', icon: Bot },
];

export function AnalysisSidebar({ activeTab, setActiveTab }: AnalysisSidebarProps) {
  return (
    <nav className="w-64 flex-shrink-0 flex flex-col border-r bg-card text-card-foreground">
      <div className="p-4">
        <Logo />
      </div>
      <Separator />
      <div className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <button
                onClick={() => setActiveTab(item.name)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  activeTab === item.name
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
