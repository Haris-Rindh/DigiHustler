import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lead, Project, PipelineStage, GroupId } from '../../types';
import { 
  PlusCircle, Filter, ChevronRight 
} from 'lucide-react';
import { ProjectDetailModal } from './ProjectDetailModal';
import { NewLeadModal } from './NewLeadModal';

const STAGES: { id: PipelineStage; label: string; badgeBg: string; textCol: string }[] = [
  { id: 'new_lead', label: '1. New Lead', badgeBg: 'bg-amber-500/15 border-amber-500/30', textCol: 'text-amber-300' },
  { id: 'under_review', label: '2. Under Review', badgeBg: 'bg-indigo-500/15 border-indigo-500/30', textCol: 'text-indigo-300' },
  { id: 'assigned', label: '3. Assigned', badgeBg: 'bg-breeze-teal/20 border-breeze-teal/40', textCol: 'text-breeze-sky' },
  { id: 'in_progress', label: '4. In Progress', badgeBg: 'bg-breeze-sky/15 border-breeze-sky/30', textCol: 'text-breeze-sky' },
  { id: 'completed', label: '5. Completed', badgeBg: 'bg-emerald-500/15 border-emerald-500/30', textCol: 'text-emerald-300' },
  { id: 'paid', label: '6. Paid & Ledgered', badgeBg: 'bg-purple-500/15 border-purple-500/30', textCol: 'text-purple-300' }
];

export const KanbanPipeline: React.FC = () => {
  const { currentUser, leads, projects, groups } = useApp();

  const [selectedGroupFilter, setSelectedGroupFilter] = useState<GroupId | 'all'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);

  const filteredLeads = leads.filter(l => selectedGroupFilter === 'all' || l.suggestedGroupId === selectedGroupFilter);
  const filteredProjects = projects.filter(p => selectedGroupFilter === 'all' || p.groupId === selectedGroupFilter);

  const getItemsForStage = (stage: PipelineStage) => {
    if (stage === 'new_lead' || stage === 'under_review') {
      const stageLeads = filteredLeads.filter(l => l.status === stage);
      return stageLeads.map(l => ({
        type: 'lead' as const,
        id: l.id,
        title: l.title,
        clientName: l.clientName,
        budget: l.budgetEstimate,
        groupId: l.suggestedGroupId,
        submittedBy: l.submittedByUserName,
        raw: l
      }));
    } else {
      const stageProjects = filteredProjects.filter(p => p.status === stage);
      return stageProjects.map(p => ({
        type: 'project' as const,
        id: p.id,
        title: p.title,
        clientName: p.clientName,
        budget: p.totalValue,
        groupId: p.groupId,
        submittedBy: p.assignedLeaderName,
        raw: p
      }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 breeze-card p-6 rounded-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-breeze-surface border border-breeze-border text-breeze-sky uppercase tracking-widest">
              Live Pipeline Dashboard
            </span>
            <span className="text-xs text-slate-400">
              Role: <strong className="text-white capitalize">{currentUser.role.replace('_', ' ')}</strong> ({currentUser.name})
            </span>
          </div>
          <h1 className="font-display font-extrabold text-3xl text-white mt-1">Leads & Projects Kanban</h1>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Centralized pipeline routing client leads from Growth & Client Acquisition down to Group Leaders and Freelancers.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Group Filter Pill Select */}
          <div className="flex items-center space-x-1 bg-breeze-dark p-1 rounded-xl border border-breeze-border text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
            <button
              onClick={() => setSelectedGroupFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${selectedGroupFilter === 'all' ? 'bg-breeze-teal text-white font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              All Groups
            </button>
            {groups.map(g => (
              <button
                key={g.id}
                onClick={() => setSelectedGroupFilter(g.id)}
                className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all ${selectedGroupFilter === g.id ? 'bg-breeze-teal text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                {g.id.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsNewLeadOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-breeze-teal hover:bg-breeze-teal-hover text-xs font-bold text-white shadow transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Lead</span>
          </button>
        </div>
      </div>

      {/* Kanban Pipeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-6">
        {STAGES.map((stage) => {
          const items = getItemsForStage(stage.id);

          return (
            <div 
              key={stage.id}
              className="flex flex-col rounded-2xl bg-breeze-dark/80 border border-breeze-border p-3 min-w-[220px]"
            >
              {/* Stage Header */}
              <div className={`p-3 rounded-xl ${stage.badgeBg} border flex items-center justify-between mb-3`}>
                <span className={`text-xs font-bold font-display ${stage.textCol}`}>{stage.label}</span>
                <span className="text-[11px] font-extrabold px-2 py-0.5 rounded bg-breeze-dark/80 text-white">
                  {items.length}
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {items.length === 0 ? (
                  <div className="p-4 text-center border border-dashed border-breeze-border rounded-xl text-[11px] text-slate-500">
                    No items in stage
                  </div>
                ) : (
                  items.map((item) => {
                    return (
                      <div 
                        key={item.id}
                        onClick={() => {
                          if (item.type === 'project') {
                            setSelectedProject(item.raw as Project);
                          } else {
                            const lead = item.raw as Lead;
                            setSelectedProject({
                              id: lead.id,
                              leadId: lead.id,
                              title: lead.title,
                              clientName: lead.clientName,
                              clientEmail: lead.clientEmail,
                              groupId: lead.suggestedGroupId,
                              assignedLeaderId: groups.find(g => g.id === lead.suggestedGroupId)?.leaderId || '',
                              assignedLeaderName: 'Unassigned',
                              brief: lead.brief,
                              totalValue: lead.budgetEstimate,
                              externalFee: 0,
                              netRevenue: lead.budgetEstimate,
                              isLeadGenIndependent: true,
                              leadGenUserPct: 15,
                              splitManagementPct: 22.5,
                              splitLeaderPct: 7.5,
                              splitFreelancerPct: 70,
                              assignments: [],
                              status: lead.status,
                              deliverables: [],
                              comments: [],
                              createdAt: lead.createdAt
                            });
                          }
                        }}
                        className="p-3.5 rounded-xl bg-breeze-surface border border-breeze-border hover:border-breeze-teal transition-all cursor-pointer space-y-2 shadow group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] uppercase font-extrabold px-2 py-0.5 rounded bg-breeze-dark text-breeze-sky border border-breeze-border">
                            {item.groupId}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-400">
                            ${item.budget.toLocaleString()}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-white group-hover:text-breeze-sky transition-colors line-clamp-2">
                          {item.title}
                        </h4>

                        <p className="text-[11px] text-slate-400 truncate">
                          Client: {item.clientName}
                        </p>

                        <div className="pt-2 border-t border-breeze-border flex items-center justify-between text-[10px] text-slate-500">
                          <span className="truncate max-w-[100px]">{item.submittedBy}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Project Drawer */}
      {selectedProject && (
        <ProjectDetailModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}

      {/* New Lead Modal */}
      {isNewLeadOpen && (
        <NewLeadModal onClose={() => setIsNewLeadOpen(false)} />
      )}
    </div>
  );
};
